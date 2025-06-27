const express = require('express');
const PDFDocument = require('pdfkit');
const BookModel = require('./models/bookModel');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');
// const ObjectID = dbo.ObjectID;
dbo.getDatabase();
app.engine('hbs', exhbs.engine(
    {
        layoutsDir:'views/',
        defaultLayout:"main",
        extname:"hbs",
        runtimeOptions: {
            allowProtoMethodsByDefault: true,
            allowProtoPropertiesByDefault: true
        }
    }
))
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(bodyparser.urlencoded({extended:true}))

app.get('/',async (req,res)=>{
    // let database = await dbo.getDatabase();
    // const collection = database.collection('books');
    // const cursor = collection.find({})
    // let books = await cursor.toArray();
    let books = await BookModel.find({})

    let message = '';
    let edit_id, edit_book;

    if(req.query.edit_id){
        edit_id = req.query.edit_id;
        // edit_book = await collection.findOne({_id: new ObjectID(edit_id)})
        edit_book = await BookModel.findOne({_id: edit_id})
    }

    if(req.query.delete_id){
    //    await collection.deleteOne({_id:new ObjectID(req.query.delete_id)})
    await BookModel.deleteOne({_id: req.query.delete_id})
       return res.redirect('/?status=3');
    }
   
    switch ( req.query.status) {
        case '1':
            message = 'Inserted Successfully!';
            break;

         case '2':
            message = 'Updated Successfully!';
            break;

        case '3':
            message = 'Deleted Successfully!';
            break;
    
        default:
            break;
    }
    res.render('main',{message,books,edit_id,edit_book})
})

// Add this for creating a book
app.post('/store_book', async (req, res) => {
    const book = new BookModel({
        title: req.body.title,
        author: req.body.author,
        email: req.body.email,
        story: req.body.story
    });
    await book.save();
    res.redirect('/');
});

// Add this for updating a book
app.post('/update_book/:edit_id', async (req, res) => {
    await BookModel.findByIdAndUpdate(req.params.edit_id, {
        title: req.body.title,
        author: req.body.author,
        email: req.body.email,
        story: req.body.story
    });
    res.redirect('/');
});

// View Book Route
app.get('/view_book/:id', async (req, res) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) return res.status(404).send('Book not found');
  res.render('view_book', { book });
});

// Download PDF Route
app.get('/download_pdf/:id', async (req, res) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) return res.status(404).send('Book not found');

  const doc = new PDFDocument();
  res.setHeader('Content-disposition', `attachment; filename="${book.title}.pdf"`);
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(18).text(book.title, { underline: true });
  doc.moveDown();
  doc.fontSize(14).text(`Author: ${book.author}`);
  doc.fontSize(12).text(`Email: ${book.email}`);
  doc.moveDown();
  doc.fontSize(14).text('Story:', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(book.story, { align: 'left' });

  doc.end();
});

app.listen(8000,()=>{console.log('Listening to 8000 port');})