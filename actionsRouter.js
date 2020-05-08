const express = require("express");
const router = express.Router();

const actionsDb = require("./data/helpers/actionModel");

// ONLY USING THIS TO GET THE PROJECTS IDs THAT EXIST!
const projectsDb = require("./data/helpers/projectModel");

let projectExists = false

router.get("/", (req, res) => {
    actionsDb.get()
    .then(actions => {
        res.status(200).json({actions: actions})
    })
})

router.post("/:id", validateAction, (req, res) => {
    const id = req.params.id
    let newAction = {
        project_id: req.params.id,
        description: req.body.description,
        notes: req.body.notes
    }
        actionsDb.insert(newAction)
        .then(newAction => {
            res.status(200).json({newAction})
        }).catch(error => {
        res.status(500).json(error)
        console.log(error)
        })

    // let newAction = {
    //     project_id: req.params.id,
    //     description: req.body.description,
    //     notes: req.body.notes
    // }
    // projectsDb.get(req.params.id)
    // .then(project => {
    //     if(project){
    //         projectExists = true
    //         res.status(200).json({SUCCESS: "CREATED POST"})
    //     } else if(!project){
    //         res.status(404).json({error: "COULD NOT FIND BY THIS ID!"})
    //     }
    // }).catch(error => {
    //     console.log(error)
    //     res.status(500).json({Error: "COULD NOT COMPLETE"})
    // })
    // if(projectExists == true){
    //     actionsDb.insert(newAction)
    //     .then(res => {
    //         res.status(200).json({SUCCESS: "CREATED POST"})
    //     }).catch(error => {
    //     res.status(500).json(error)
    //     console.log(error)
    //     })
    // }
})


router.delete('/:id', validateId, (req, res) => {
    const id = req.params.id
    actionsDb.remove(id)
    .then(response => {
      res.status(200).json(`succesfully deleted action with id: ${id}`);
    })
    .catch(error => {
      res.status(500).json({message: "Could not retrieve data"})
    })
});

router.put('/:id', validateId, validateActionPut, (req, res) => {
    const id = req.params.id
    const updatedAction = {
        description: req.body.description,
        notes: req.body.notes
    }
    actionsDb.update(id, updatedAction)
    .then(post => {
          res.status(200).json({MESSAGE: "SUCCESS PUT!"})
    }).catch(error => {
        res.status(500).json({ error: 'The post information could not be modified' })
    })
});

router.get('/:id', validateId, (req, res) => {
    const id = req.params.id
    actionsDb.get(Number(id))
    .then(action => {
      res.status(200).json({action: action})
    })
    .catch(error => {
      res.status(500).json({message: "could not retrieve user data"})
    })
});

// MIDDLEWARE
function validateId(req, res, next) {
    actionsDb.get(req.params.id)
    .then(user => {
      if(user) {
        req.user = user
        next()
      }else{
        res.status(400).json({message: "invalid user id" })
      }
    })
}

function validateAction(req, res, next) {
    actionsDb.get(req.params.id)
        .then(action => {
            if(action) {
                if (Object.keys(req.body).length === 0) {
                    res.status(400).json({message: 'missing post data'})
                } else if (!req.body.notes || !req.body.description) {
                    res.status(400).json({message: 'missing required text fields'}).end()
                } else {
                    next()
                }
            } else {
            res.status(400).json({message: "invalid user id" })
            }
        })
}

function validateActionPut(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({message: 'missing post data'})
    } else if (!req.body.description || !req.body.notes) {
        res.status(400).json({message: 'missing required text field'}).end()
    } else {
        next()
    }
}



module.exports = router;