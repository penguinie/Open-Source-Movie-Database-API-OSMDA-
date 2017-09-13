var express                 = require("express"),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    app                     = express();

mongoose.connect("mongodb://localhost/movies");

var movieSchema = new mongoose.Schema({
  cover : String,
  title : String,
  genres : [],
  release : Date,
  runtime : Number,
  country : String,
  language : [],
  director : String,
  rating : Number,
  box_office : {
    budget : Number,
    gross : Number
  }
});
var Movie = mongoose.model("movie", movieSchema);

var port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get("/", function(req, res){
  res.redirect("/movies");
});

app.get("/movies", function(req, res){
  Movie.find({}, function(error, movies){
    if(error){res.send(error);}
    else{res.json(movies);}
  });
});

app.get("/movies/:id", function(req, res){
  Movie.findById(req.params.id, function(error, movie){
    if(error){res.send(error);}
    else(res.json(movie));
  });
});

app.post("/movies", function(req, res){
  var i=0;
  for(i=0; i<3; i++){
    var newMovie = req.body.content[i];
    Movie.create(newMovie);
  }
  res.redirect("/movies");
});

app.put("/movies/:id", function(req, res){
  Movie.findById(req.params.id, function(error, movie){
    if(error){res.send(error);}
    else{
      movie.cover = req.body.image;
      movie.title = req.body.title;
      movie.genres = [req.body.genres];
      movie.release = new Date(req.body.release);
      movie.runtime = req.body.runtime;
      movie.country = req.body.country;
      movie.language = [req.body.language];
      movie.director = req.body.director;
      movie.rating = req.body.rating;
      movie.box_office.budget = req.body.budget;
      movie.box_office.gross = req.body.gross;

      movie.save();
      res.redirect("/movies/"+req.params.id);
    }
  });
});

app.delete("/movies/:id", function(req, res){
  Movie.findByIdAndRemove(req.params.id, function(error){
    if(error){res.send(error);}
    else{res.redirect("/movies");}
  });
});

app.listen(port, function(){
  console.log("Movie Database Server Started");
  console.log("Port :"+port);
});
