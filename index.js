var http = require("http");
var server = http.createServer();
var url = require("url");
var file_system = require("fs");
var my_sql = require("mysql");
/* remote
var my_sql_conn = my_sql.createConnection({
                    host : "www.db4free.net",
                    port : 3306,
                    user : "movie_shop",
                    password : '12345678'
});
*/
//local
//establish connection to db server
var my_sql_conn = my_sql.createConnection({
                    host : "localhost",
                    port : 3306,
                    user : "root",
                    password : ''
});

//connect to existing db
var my_sql_conn_db = my_sql.createConnection({
                    host : "localhost",
                    port : 3306,
                    user : "root",
                    password : '',
                    database : "movie_shop"
});


var style = '<style>#home_container{width:25%;height:5%;}#home_container input{width:25%;height:4%;}</style>';

var body = '<html><head><title>MovieShop</title>'+
           '<script  src="https://code.jquery.com/jquery-3.3.1.min.js"  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="  crossorigin="anonymous"></script>'+
            '</head>'+
            '<body>'+style+
            '<span id ="home_container"></span><span id ="home_container"><input type="button" onclick="window.location.href=\'/\'" value="Home"></span><span id ="home_container"><input type="button" onclick="window.location.href=\'movie_find\'" value="Search"></span><span id ="home_container"><input type="button" onclick="window.location.href=\'db_add\'" value="Add Movie"></span>'+
            '<h1 id="heading">Hello there</h1><hr>'+
            '<p id ="1"></p>';

//server
server.on("request",function(request, respond){
   var path = url.parse(request.url).pathname;
   var url_query = url.parse(request.url).query;
    
    //-------------------------------
   var side_navi = file_system.readFile('public/sid_navi.html', function(err, data){
            if(err){
                respond.write('<p>Side navi couldnt be loaded');
            }
        else{
           respond.write(data);
        }
    
});
//---------------------------------------
    
    
 respond.writeHead(200);
    respond.write(body);
    
    
   
    //=============================
    //router
    if(path == '/' || path == ''){//if path is home
    respond.write("<script>document.getElementById('heading').innerHTML ='Home';</script>");
      // respond.end();
    }
    
    if(path == '/mysql'){//path is my sql
        routing(respond);
    }
    if(path == '/db_add'){//path is db add contents
        db_add(url_query, respond);
    }
    
    if(path == '/db_write'){//path is db add contents
        db_write(url_query, respond);
    }
   
    if(path == '/movie_find'){//path is db add contents
        movie_find(url_query, respond);
    }
    
    if(path == '/movie_find_show_all'){//show all movies on db
        movie_find_show_all(url_query, respond);
    }
    else{//path is unknown
    respond.write("<script>document.getElementById('heading').innerHTML ='Incorrect url';</script>")
    //respond.end();
    }
    //==============================
   
    //respond.end();
    
    
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//routed to mysql table create
function routing(respond){
    respond.write("<script>document.getElementById('heading').innerHTML ='SQL db& table create';</script>")
    my_sql_conn.connect(function(err){//doing mysql connection handshake aka test connectability
        if(err){
            respond.write("<p>connection error: "+err+"</p>");
            //return respond.end();//ending here
        }
        else{
            respond.write("<p>connected to db</p>");
             //respond.end();//ending here
        }
    //create database give a name;
       my_sql_conn.query("CREATE DATABASE movie_shop",function(err, results){
           
        if(err){
            respond.write("<p>DB creation err "+err+"</p>");
            //return respond.end();//ending here
        }
        else{
            respond.write("<p>DB created "+results+"</p>");
             //respond.end();//ending here
        }
           
       }); 
        
        //create db table
        var mysql_db_table ="CREATE TABLE movie_table(movie_id int NOT NULL AUTO_INCREMENT PRIMARY KEY, m_title varchar(255), m_director varchar(255), m_producer varchar(255), m_production_company varchar(255), m_country varchar(255), m_actor varchar(255), m_genre varchar(255), m_description varchar(255), m_disclaimer varchar(255))";
        
        //connect to existing db
        my_sql_conn_db.query(mysql_db_table, function(err, results){
           
        if(err){
            respond.write("<p>table creation err "+err+"</p>");
           return respond.end();//ending here
        }
        else{
            respond.write("<p>table created "+results+"</p>");
            respond.end();//ending here
        }
           
       }
           
        );
    });
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
//create db moving adding form
function db_add(url_query, respond){
respond.write("<script>document.getElementById('heading').innerHTML ='DB Add data';</script>");
    
    var add_form ='<input type ="text" id="m_title" placeholder="Please enter Movie title" style="width:60%;height:5%; text-align:center;margin-left:20%"><br><input type ="text" id="m_director" placeholder="Please enter Movie director name" style="width:60%;height:5%;text-align:center;margin-left:20%"><br><input type ="text" id="m_producer" placeholder="Please enter Movie producer name" style="width:60%;height:5%;text-align:center;margin-left:20%"><br><input type ="text" id="m_production_company" placeholder="Please enter Movie production company" style="width:60%;height:5%;text-align:center;margin-left:20%"><br><input type ="text" id="m_country" placeholder="Please enter country movie produced in" style="width:60%;height:5%;text-align:center;margin-left:20%"><br><input type ="text" id="m_actor" placeholder="Please enter Movie Starring" style="width:60%;height:5%;text-align:center;margin-left:20%"><br><input type ="text" id="m_genre" placeholder="Please enter Movie genre" style="width:60%;height:5%;text-align:center;margin-left:20%"><br><textarea id="m_description" style="width:60%;height:10%;text-align:center;margin-left:20%">Please give Movie description</textarea><br><input type ="text" id="m_disclaimer" placeholder="Please give Movie disclaimer" style="width:60%;height:5%;text-align:center;margin-left:20%"><hr><input type="button" onclick ="db_write()" value="Save data" style="width:100%;height:10%;">'+ 
  '<script> var  m_title=document.getElementById("m_title");var  m_director=document.getElementById("m_director");var  m_producer=document.getElementById("m_producer");var  m_production_company=document.getElementById("m_production_company");var  m_country=document.getElementById("m_country");var  m_actor=document.getElementById("m_actor");var  m_genre=document.getElementById("m_genre"); var  m_description=document.getElementById("m_description");var  m_disclaimer=document.getElementById("m_disclaimer"); function db_write(){if(m_title.value==""||m_director.value==""||m_producer.value==""||m_production_company.value==""||m_country.value==""||m_actor.value==""||m_genre.value==""||m_description.value==""||m_disclaimer.value==""){ document.getElementById("heading").innerHTML ="Please feel in all information";}else{ window.open("db_write?"+m_title.value+"&"+m_director.value+"&"+m_producer.value+"&"+m_production_company.value+"&"+m_country.value+"&"+m_actor.value+"&"+m_genre.value+"&"+m_description.value+"&"+m_disclaimer.value, "_self");} /*alert(m_title.value+"&"+m_director.value+"&"+m_producer.value+"&"+m_production_company.value+"&"+m_country.value+"&"+m_actor.value+"&"+m_genre.value+"&"+m_description.value+"&"+m_disclaimer.value)*/;}</script>';
    
    respond.write(add_form);
    
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//write data to db
function db_write(url_query, respond){

    // create an array
var data_to_write = url_query.replace(/%20/g, " ").split('&');
    
respond.write("<script>document.getElementById('heading').innerHTML ='DB Add data 2';</script>");
    
  console.log(data_to_write);
    //add data to db table
        my_sql_conn.connect(function(err){//doing mysql connection handshake aka test connectability
        if(err){
            respond.write("<p>connection error: "+err+"</p>");
            //return respond.end();//ending here
        }
        else{
           // respond.write("<p>connected to db</p>");
             //respond.end();//ending here
        }
         
        //add data to db
        var mysql_db_data_add ="INSERT INTO movie_table(m_title, m_director, m_producer, m_production_company, m_country, m_actor, m_genre, m_description, m_disclaimer) VALUES ('"+data_to_write[0]+"','"+data_to_write[1]+"','" +data_to_write[2]+"','" +data_to_write[3]+"','" +data_to_write[4]+"','" +data_to_write[5]+"','" +data_to_write[6]+"','" +data_to_write[7]+"','" +data_to_write[8]+"')";    
            
       // console.log(mysql_db_data_add);
            //connect to existing db
            
        my_sql_conn_db.query(mysql_db_data_add, function(err, results){
           
        if(err){
            respond.write("<p>Data adding err "+err+"</p>");
           return respond.end();//ending here
        }
        else{
            respond.write("<p>Data added "+JSON.stringify(results)+"</p>");
            respond.end();//ending here
        }
           
       }
           
        );             
            
        });
    //respond.write(url_query);
}
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
//movie search

function movie_find(url_query, respond){
    
    respond.write("<script>document.getElementById('heading').innerHTML ='Movie search';</script>");
    
    var search_input ='<style>input[type=search] {width: 130px;box-sizing: border-box;border: 2px solid #ccc;border-radius: 4px;font-size: 16px;background-color: white;  margin:2% auto 2% 40%;background-image:url("searchicon.png");background-position: 10px 10px;background-repeat: no-repeat;padding: 12px 20px 12px 40px;-webkit-transition: width 0.4s ease-in-out;transition: width 0.4s ease-in-out;}input[type=search]:focus {width: 95%;margin:2% auto 2% auto;}/* #searh_input{margin:2% auto 2% 40%;width: 50%;} */</style><input type="search" name="search" placeholder="Search.." id="search_input"><br><hr><a href="movie_find_show_all" onclick ="">Show all stored movies</a><hr>'; 
    
    <script>
        
    function call_db_search(){
        
        var search_query = document.getElementById("search_input");
        
        if(search_query.value == ""){
            document.getElementById("heading").innerHTML ="Please feel data to be searched for";
        }
        else{
            window.open()
        }
    }
        
        </script>

    respond.write(search_input);
    
}

function movie_find_search(url_query, respond){
        respond.write("<script>document.getElementById('heading').innerHTML ='Movie search : '+url_query.va ;</script>");
    
    
    
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//show all movies    
function movie_find_show_all(url_query, respond){
    respond.write("<script>document.getElementById('heading').innerHTML ='Movie search All';</script>");
    
    var search_input ='<style>input[type=search] {width: 130px;box-sizing: border-box;border: 2px solid #ccc;border-radius: 4px;font-size: 16px;background-color: white;  margin:2% auto 2% 40%;background-image:url("searchicon.png");background-position: 10px 10px;background-repeat: no-repeat;padding: 12px 20px 12px 40px;-webkit-transition: width 0.4s ease-in-out;transition: width 0.4s ease-in-out;}input[type=search]:focus {width: 95%;margin:2% auto 2% auto;}/* #searh_input{margin:2% auto 2% 40%;width: 50%;} */</style><input type="search" name="search" placeholder="Search.."><br><hr><a href="movie_find_show_all" onclick ="">Show all stored movies</a><hr>'; 

    respond.write(search_input);
    
    
        //get data from db
        my_sql_conn.connect(function(err){//doing mysql connection handshake aka test connectability
        if(err){
            respond.write("<p>connection error: "+err+"</p>");
            //return respond.end();//ending here
        }
        else{
           // respond.write("<p>connected to db</p>");
             //respond.end();//ending here
        }
         
        //add data to db
        var mysql_db_data_get =  "SELECT * FROM movie_table"
            
       
        //connect to existing db
            
        my_sql_conn_db.query(mysql_db_data_get, function(err, results){
           
        if(err){
            respond.write("<p>Data adding err "+err+"</p>");
           return respond.end();//ending here
        }
        else{
           // respond.write("<p>Data added "+JSON.stringify(results[0].m_producer)+"</p>");
            var result = results;
            var count =0;
            for(var i =0; i<=result.length; i++){
            db_data_shower();//break if setup is not like this
            count = count+i;
                
            }
                

            
            //respond.end();//ending here
        }
           function db_data_shower(){
            respond.write("<p>Movie Title : "+result[count].m_title+" | Movie Director : "+result[count].m_director+" | Movie Producer : "+result[count].m_producer+" | Movie Producing Company : "+result[count].m_production_company+" | Movie filmed Country : "+result[count].m_country+" | Movie Starring : "+result[count].m_actor+" | Movie Genre : "+result[count].m_genre+" | Movie Synopsis : "+result[count].m_description+" | Movie Disclaimer : "+result[count].m_disclaimer+"</p><hr>");
           }
       }
           
        );             
            
        });
    
}    







//********************************************************
server.on("close", function(){console.log("connection closed")});

server.listen(3000);