import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
        .map((obj) => obj.tags)
        .flat()
        .slice(0, 5);

        res.json(tags);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалось отримати статті"        
    });
};
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалось отримати статті"        
    });
};
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id; 

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true }
        );

        if (!doc) {
            return res.status(404).json({
                message: "Стаття не знайдена"
            });
        }

        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Не вдалось отримати статтю"
        });
    }
};


export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        
      const doc = await PostModel.findOneAndDelete({
        _id: postId
       })
     
        if (!doc) {
            return res.status(404).json({
                message: "Стаття не знайдена"
            })
        }

        res.json({
            success: true
        })

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалось видалити статті"        
    });
};
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалось створити пост"
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
            _id: postId 
            }, 
            {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            }
    
    );

    res.json({
        success: true,
    })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалось обновити статтю',
        });
    }
};
