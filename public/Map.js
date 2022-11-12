const draw = (option) => {
    var images;
    var canvas;
    var drawOrder;

    if (option === "main" || option =="loading"){
        images = {
            background: '/Images/map/country-platform-back.png',
        };

        drawOrder = [ 
            {id: 'background', position: {x: 0, y: 0}}
        ]
    }

    else if (option === "game"){
        images = {
            background: '/Images/map/country-platform-back.png',
            tiles: '/Images/map/country-platform-tiles-example.png',
            // idle_left: '/Images/character_left/Cowboy4_idle without gun_2.png',
            // idle_right: '/Images/character_right/Cowboy4_idle without gun_2.png'
        };

        drawOrder = [ 
            {id: 'background', position: {x: 0, y: 0}},
            {id: 'tiles', position: {x: -75, y: -65}},
            // {id: 'idle_left', position: {x:120,y: 90, w:40, h:40}},
            // {id: 'idle_right', position: {x:140,y: 90, w:40, h:40}},
        ];
    }

    canvas = addImages(images, drawOrder);

    return canvas;
}

const addImages = (images, drawOrder) => {
    const canvas = document.createElement("CANVAS");
    const ctx = canvas.getContext("2d");
      
      for(let key in images){
        let image = new Image();
        image.src = images[key];
        image.onload = function(){
          images[key] = image;
          draw();
        };
      }
      
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high'; 
      
      var current = 0;

      var draw = function(){
      
        var step = drawOrder[current];
        if(typeof images[step.id] === 'string') return ; // not loaded yet
        
        if(!Array.isArray(step.position)) step.position = [step.position];
      
        step.position.forEach(pos => 
          'w' in pos
          ? ctx.drawImage(images[step.id], pos.x, pos.y, pos.w, pos.h)
          : ctx.drawImage(images[step.id], pos.x, pos.y)
        );
      
        current++;
        if(current < drawOrder.length)
          draw();
      };

      return canvas;
}