const express = require("express");
const router = express.Router();

const projectsDb = require("./data/helpers/projectModel");


router.get("/", (req, res) => {
    projectsDb.get()
    .then(projects => {
        res.status(200).json({projects: projects})
    })
})

router.get('/:id', validateId, (req, res) => {
    const id = req.params.id
    projectsDb.get(Number(id))
    .then(project => {
      res.status(200).json({project: project})
    })
    .catch(error => {
      res.status(500).json({message: "could not retrieve user data"})
    })
});

router.post("/", validateProject, (req, res) => {
    let newPost = req.body;
    projectsDb.insert(newPost)
    .then(projects => {
        res.status(200).json({MESSAGE: "POST SUCCESS!"})
    }).catch(error => {
        res.status(500).json({error: error})
    })
})

router.delete('/:id', validateId, (req, res) => {
    const id = req.params.id
    projectsDb.remove(id)
    .then(response => {
      res.status(200).json(`succesfully deleted project with id: ${id}`);
    })
    .catch(error => {
      res.status(500).json({message: "Could not retrieve data"})
    })
});

router.put('/:id', validateId, validateProject, (req, res) => {
    const id = req.params.id
    const updatedProject = {
        name: req.body.name,
        description: req.body.description
    }
    projectsDb.update(id, updatedProject)
    .then(post => {
          res.status(200).json({MESSAGE: "SUCCESS PUT!"})
    }).catch(error => {
        res.status(500).json({ error: 'The post information could not be modified' })
    })
});

function validateId(req, res, next) {
    projectsDb.get(req.params.id)
    .then(user => {
      if(user) {
        req.user = user
        next()
      }else{
        res.status(400).json({message: "invalid user id" })
      }
    })
}

function validateProject(req, res, next) {
    console.log(req.body)
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({message: 'missing post data'})
    } else if (!req.body.name || !req.body.description) {
        res.status(400).json({message: 'missing required text field'}).end()
    } else {
        next()
    }
}



module.exports = router;