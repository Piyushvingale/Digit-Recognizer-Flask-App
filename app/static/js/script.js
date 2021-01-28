var canvas = document.getElementById("paint");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var curX, curY, prevX, prevY;
var hold = false;
ctx.lineWidth = 20;
var fill_value = true;
var stroke_value = false;
var canvas_data = {"pencil": [], "line": []}
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
                        
function color(color_value){
    ctx.strokeStyle = color_value;
    ctx.fillStyle = "black";
}    
color('#FFFFFF')
        
function add_pixel(){
    ctx.lineWidth += 1;
}
        
function reduce_pixel(){
    if (ctx.lineWidth == 1){
        ctx.lineWidth = 1;
    }
    else{
        ctx.lineWidth -= 1;
    }
}
        
function fill(){
    fill_value = true;
    stroke_value = false;
}
        
function outline(){
    fill_value = false;
    stroke_value = true;
}
               
function reset(){
    canvas_data = { "pencil": [], "line": []}
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
        
// pencil tool
        
function pencil(){
        
    canvas.onmousedown = function(e){
        curX = e.clientX - canvas.offsetLeft;
        curY = e.clientY - canvas.offsetTop;
        hold = true;
            
        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };
        
    canvas.onmousemove = function(e){
        if(hold){
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            draw();
        }
    };
        
    canvas.onmouseup = function(e){
        hold = false;
    };
        
    canvas.onmouseout = function(e){
        hold = false;
    };
        
    function draw(){
        ctx.lineTo(curX, curY);
        ctx.stroke();
        canvas_data.pencil.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
    }
}
        
// line tool
        
function line(){
           
    canvas.onmousedown = function (e){
        img = ctx.getImageData(0, 0, width, height);
        prevX = e.clientX - canvas.offsetLeft;
        prevY = e.clientY - canvas.offsetTop;
        hold = true;
    };
            
    canvas.onmousemove = function linemove(e){
        if (hold){
            ctx.putImageData(img, 0, 0);
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(curX, curY);
            ctx.stroke();
            canvas_data.line.push({ "starx": prevX, "starty": prevY, "endx": curX, "endY": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
            ctx.closePath();
        }
    };
            
    canvas.onmouseup = function (e){
         hold = false;
    };
            
    canvas.onmouseout = function (e){
         hold = false;
    };
}
        
function save(){
    var image = canvas.toDataURL();

    $.ajax({
        url: "/",
        type: "post",
        data: {
            save_image: image,
        },
        success: function(response) {
            reset();
            document.getElementById('predicted_digit').innerHTML = response;
        },
        error: function(xhr) {
            //Do Something to handle error
        }
    });

    
} 
