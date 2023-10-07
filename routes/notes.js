import exress from 'express'
import fetchUser from '../middleware/fetchUser.js';
import Notes from '../models/Notes.js'
const router = exress.Router();

// get all notes but login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.userId })
        res.json(notes)

    } catch (error) {
        console.log(error);
        res.status(error, "Enternal Server Error ")

    }

})

// add new notes  Login required
router.post('/addnote', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body
        if (!title || !description || !tag) {
            res.status(400).json({ error: "All Fields are Required" })
        }
        const notes = await Notes({
            title,
            description,
            tag,
            user: req.userId
        })
        const saveNote = await notes.save();
        res.json(saveNote)

    } catch (error) {
        console.log(error);

    }
})

//update notes Login required

router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body
    const { id } = req.params;

    try {

        //find notes to update
        const note = await Notes.findById({ _id: id })

        //validation
        if (!note) {
            return res.status(404).send("Notes Not Fount")
        }

        if (note.user.toString() !== req.userId) {
            return res.status(401).send("Not Allowed")


        }
        console.log(note);


        //Notes Updated
        const notes = await Notes.findByIdAndUpdate({ _id: id }, {
            $set: {
                title,
                description,
                tag
            }
        }, { new: true })
        res.json({ notes, success: "Notes Updated Successfully" })


    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }

})

//delete notes login required

router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Notes Not Found")
        }

        if (note.user.toString() !== req.userId) {
            return res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ Success: "Note Deleted Successfully", note: note })


    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }

})


//get all notes by ID
router.get('/notes/:id', fetchUser, async (req, res) => {

    try {
        const { id } = req.params;
        const notes = await Notes.findById({ _id: id })
        console.log(notes);

        if (notes) {
            return res.status(200).json(notes);
        }
        else {
            return res.status(404).json({ success: "notes not found" })
        }

    }

    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }

})











export default router