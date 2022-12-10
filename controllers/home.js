const Blog = require('../models/blog');
const User = require('../models/user');
const Report = require('../models/report');
const Keyword = require('../models/keyword')
const moment = require('moment');
const Alert = require('alert');

exports.dashboard = async (req, res) => {
    const { category } = req.query;
    const search = req.body.search;
    const sortby = req.body.sortby;
    const sorted = {};
    var sortName = ''

    const keyword = category ? {
        category: {
            $regex: category,
            $options: 'i'
        }
    } : {}

    const searchkeyword = search ? {
        title: {
            $regex: search,
            $options: 'i'
        }
    } : {}

    if (sortby) {
        if (sortby === 'publish') {
            sorted['createdAt'] = -1
            sortName = 'publish'
        }
        else {
            sorted['total_vote'] = -1
            sortName = 'vote'
        }
    }
    else {
        sorted['createdAt'] = -1
        sortName = 'publish'
    }

    const blogs = await Blog.find({ ...keyword, ...searchkeyword }).populate('user', 'name avatar').sort({ ...sorted });
    const user = await User.findById(req.user._id).populate({
        path:'notifications',
        populate:{
            path:'from',
            select:'name avatar admin'
        }
    });
    console.log(sortName)
    res.render('home', { title: "Blogger’s Territory| Home", blogs, category, user: user, search, sortName,isHomePage:true })
};

exports.profile = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path:'notifications',
        populate:{
            path:'from',
            select:'name avatar admin'
        }
    });
    const blogs = await Blog.find({ user: req.user._id });
    res.render('profile', { title: "Blogger’s Territory| Profile", user, blogs })
};

exports.userProfile = async (req, res) => {
    const id = req.params.id;
    const user= await User.findById(req.user._id);
    const bloguser = await User.findById(id).populate({
        path:'notifications',
        populate:{
            path:'from',
            select:'name avatar admin'
        }
    });
    const blogs = await Blog.find({ user: id });

    res.render('userProfile', { title: "Blogger’s Territory| Profile", bloguser, blogs,user })
}

exports.openCreateBlogPage = async(req, res) => {
    const user = await User.findById(req.user._id).populate({
        path:'notifications',
        populate:{
            path:'from',
            select:'name avatar admin'
        }
    });

    res.render('create', { title: "Blogger’s Territory| Create Blog", user })
};

exports.createBlog = async (req, res) => {
    try {
        const { title, description } = req.body;
        var error = 0;
        const keywords = await Keyword.find();

        keywords.forEach(keyword => {
            if (title.toLowerCase().includes(keyword.name) || description.toLowerCase().includes(keyword.name)) {
                error += 1
            }
        })

        if (error > 0) {
            Alert("You can not post this blog. Please check all spellings and bad words.");
            res.redirect('/create')
        }
        else {

            const newBlog = new Blog({
                ...req.body,
                user: req.user._id
            })

            await newBlog.save();
            // Date
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1;
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();

            const user = await User.findById(req.user._id);

            const timeLineIndex = user.timeLine.findIndex(timeLine => (timeLine.day === day && timeLine.month === month && timeLine.year === year));

            if (timeLineIndex > -1) {
                user.timeLine[timeLineIndex].post += 1
            }
            else {
                user.timeLine.push({
                    day: day,
                    month: month,
                    year: year,
                    post: 1
                })
            }

            const topicIndex = user.topic.findIndex(t => t.category === req.body.category);
            if (topicIndex > -1) {
                user.topic[topicIndex].total += 1
            }
            else {
                user.topic.push({
                    category: req.body.category,
                    total: 1
                })
            }

            await user.save();

            res.redirect(`/blog/${newBlog._id}`)
        }

    } catch (error) {

        res.render('/create', { error: error.message })
    }
}

exports.deleteBlog=async(req, res) => {
    try {
        const blog= await Blog.findById(req.params.id).remove();
        res.json({ success: true })
        
    } catch (error) {
        res.json({ success: false})
    }
}


exports.getEditBlog= async (req, res) => {
    const blog=await Blog.findById(req.params.id);
    const user = await User.findById(req.user._id).populate({
        path:'notifications',
        populate:{
            path:'from',
            select:'name avatar admin'
        }
    });

    res.render('blog_edit',{blog,user})
}

exports.editBlog= async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    blog.title=req.body.title;
    blog.description=req.body.description;
    blog.bannerImage=req.body.bannerImage;

    await blog.save();
    res.redirect(`/blog/${req.params.id}`)
}


exports.uploadImage = (req, res) => {
    let file = req.files.image;
    let date = new Date();

    let imagename = date.getDate() + date.getTime() + file.name;

    let path = 'public/uploads/' + imagename;


    file.mv(path, (err, result) => {
        if (err) {
            throw err;
        } else {

            res.json(`uploads/${imagename}`)
        }
    })
}

exports.getBlog = async (req, res) => {
    try {
        
    const user = await User.findById(req.user._id).populate({
        path:'notifications',
        populate:{
            path:'from',
            select:'name avatar admin'
        }
    });
    var blog = await Blog.findById(req.params.id)
        .populate('user', 'name avatar admin')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name avatar'
            }
        })
    console.log(blog)
    blog.createTime = new Date(blog.createdAt).toLocaleDateString();
    blog.timeAgo = moment(blog.createdAt).fromNow(false);
    blog.textHtml = convertToMarkdown(blog.description);

    res.render('blog', { title: "Blogger’s Territory| Blog", isBlogPage: true, blog: blog, user })
} catch (error) {
    res.redirect('/')
        
}
};

exports.comment = async (req, res) => {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    blog.comments.push({
        content: req.body.content,
        user: req.user._id
    })
    await blog.save();
    res.redirect(`/blog/${blogId}`)
}


exports.upvote = async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    const userindex = blog.upvote.findIndex(v => v.equals(req.user._id))
    const userindex1 = blog.downvote.findIndex(v => v.equals(req.user._id))
    if (userindex > -1) {
        blog.upvote.splice(userindex,1);
        await blog.save();
        return res.json({ success: false, total: blog.upvote.length })
    }
    else {
        blog.upvote.push(req.user._id)
        if(userindex1 > -1){
            blog.downvote.splice(userindex1,1);
        }
        else blog.total_vote += 1
        await blog.save();
        return res.json({ success: true,downvoted:userindex1===-1,downvoteTotal: blog.downvote.length, total: blog.upvote.length })
    }
};

exports.downvote = async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    const userindex = blog.downvote.findIndex(v => v.equals(req.user._id))
    const userindex1 = blog.upvote.findIndex(v => v.equals(req.user._id))
    if (userindex > -1) {
        blog.upvote.splice(userindex,1);
        await blog.save();
        return res.json({ success: false, total: blog.upvote.length })
    }
    else {
        blog.downvote.push(req.user._id)
        if(userindex1>-1) blog.upvote.splice(userindex1,1)
        else blog.total_vote -= 1
        await blog.save();
        return res.json({ success: true,upvoted:userindex1===-1,upvoteTotal: blog.upvote.length, total: blog.downvote.length })
    }
};


const convertToMarkdown = (data) => {
    let ele = ''
    data = data.split("\n").filter(item => item.length);
    // console.log(data);

    data.forEach(item => {
        // check for heading
        if (item[0] == '#') {
            let hCount = 0;
            let i = 0;
            while (item[i] == '#') {
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele += `<${tag} class="blog-com">${item.slice(hCount, item.length)}</${tag}>`
        }
        //checking for image format
        else if (item[0] == "!" && item[1] == "[") {
            let seperator;

            for (let i = 0; i <= item.length; i++) {
                if (item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")") {
                    seperator = i;
                }
            }

            let alt = item.slice(2, seperator);
            let src = item.slice(seperator + 2, item.length - 1);
            newsrc = 'uploads/' + src.split('uploads')[1].slice(1, -1);
            ele += `<img src="http://localhost:3000/${newsrc}" alt="${alt}" class="article-image">`;
        }
        else if(item[0] === '-'){
            ele +=`<ul><li class="blog-com">• ${item.slice(1)}</li></ul>`
        }

        else {
            ele += `<p class="blog-com">${item}</p>`;
        }
    })

    return ele;
}

exports.getTimeLine = async (req, res) => {
    const user = await User.findById(req.user._id);

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var year = dateObj.getUTCFullYear();

    let timeLine = user.timeLine.filter(time => time.month === month && time.year === year);


    return res.json({ timeLine: timeLine, month: month, year: year });
}

exports.getUserTimeLine= async (req, res) => {
    const user = await User.findById(req.params.id);

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var year = dateObj.getUTCFullYear();

    let timeLine = user.timeLine.filter(time => time.month === month && time.year === year);


    return res.json({ timeLine: timeLine, month: month, year: year });
}

exports.reportToAdmin = async (req, res) => {
    const { report_by, report_to, blogId } = req.params;
    const user1 = await User.findById(report_by);
    const user2 = await User.findById(report_to);
    const newReport = await Report.create({ report_by, report_to, blogId });
    user2.totalNotification+=1;
    user2.notifications.push({
        from:user1._id,
        message:`${user1.name} has reported your post.`
    })

    await user2.save();

    
    res.json({ success: true })
}

exports.notifyChange= async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user.totalNotification>0){
        user.totalNotification-=1
        await user.save();
    }
    res.json({success:true})
}

exports.getEditProfile= async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render('profile_edit',{user})
}

exports.editProfile= async (req, res) => {
    const {name,email,profession,avatar}= req.body;
    console.log(req.body)

    const user = await User.findById(req.query.id);

    user.name = name;
    user.email = email;
    user.profession = profession;
    user.avatar = avatar;

    await user.save();

    res.redirect('/profile')

}


