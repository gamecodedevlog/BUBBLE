class Animate{
    constructor(id,object,state,x,y,callback){
        this.id = id;
        this.object = object;
        this.state = state;
        this.x = x;
        this.y = y;
    
        this.objectState = Object.values(object)[state];
        this.glint = 0;
        this.w = 0;
        this.h = 0;
        this.index =0;

        this.reverseX = 1;
        this.reverseY = 1;
        this.reverseImg = 1;

        this.callback = function(){};

        if(!isEmpty(callback))this.callback = callback;
    }

    nextFrame(ani_index){
        if(isEmpty(this.objectState))return;
        if(this.index < this.objectState[0].length-1){
            this.index++;
        }else{
            this.index=0;
            if(!isEmpty(this.callback))this.callback(AnimateContainer.END_FRAME,ani_index);
        }
        if(!isEmpty(this.callback))this.callback(AnimateContainer.NEXT_FRAME,ani_index);
        if(this.glint > 0){
            this.glint--;
        }
    }
    
    setState(state,x,y){
        this.x = x;
        this.y = y;
        this.state = state;
        this.index = 0;
        this.objectState = Object.values(this.object)[state];
    }

    setGlint(glint){
        this.glint = glint;
    }

    setReverseX(reverse){
        this.reverseX = reverse;
        this.reverseImg = reverse;
    }
}

class AnimateContainer{
    static END_FRAME = 0;
    static NEXT_FRAME = 1;
    static COLLISION = 2;

    collision = new GCollision();
    gravityArray = null;
    _W = 0;
    _H = 0;
    constructor(){
        this.objectArray = new Array(0);
        this.newObjectArray = new Array(0);
        this.scale = 1;
    }

    checkCollision(){
        for (var i = 0; i < this.objectArray.length; i++) {
            for (var j = 0; j < this.objectArray.length; j++) {
                if(i == j)continue;
                if(isEmpty(this.objectArray[i]))continue;
                if(isEmpty(this.objectArray[j]))continue;
                if(this.collision.hitRectangle(this.objectArray[i],this.objectArray[j])){
                    this.objectArray[i].callback(AnimateContainer.COLLISION,i,j); 
                }
            }  
        }
    }

    nextFrame(context){
        for (var index = 0; index < this.objectArray.length; index++) {
            this.objectArray[index].nextFrame(index);
            var element = this.objectArray[index];
            if(isEmpty(element))continue;
            var image = IMAGE[element.id][Math.abs(element.objectState[0][element.index])];
            if(isEmpty(image))continue;
            element.w = image.width;
            element.h = image.height;
            element.x += element.objectState[1][element.index] * element.reverseX;
            element.y += element.objectState[2][element.index] * element.reverseY;

            var idx_X_1=parseInt((element.x) /this._W);
            var idx_X_2=parseInt((element.x+element.w) /this._W);
            var idx_Y=parseInt(element.y /this._H);
            if(this.gravityArray[idx_Y][idx_X_1] != 0 ){
                if(!isEmpty(element.objectState[3]))
                if(element.objectState[3][element.index] !=0)
                element.x = ((idx_X_1+1) * this._W);
            }
            if(this.gravityArray[idx_Y][idx_X_2] != 0 ){
                if(!isEmpty(element.objectState[3]))
                if(element.objectState[3][element.index] !=0)
                element.x = (idx_X_1 * this._W);
            }

            var idx_X_1_10=parseInt((element.x+10) /this._W);
            var idx_X_2_10=parseInt((element.x+element.w-10) /this._W);
            if(!isEmpty(element.objectState[3])){
                element.y += element.objectState[3][element.index];
                if(!isEmpty(this.gravityArray)){
                    if(this.gravityArray[idx_Y+1][idx_X_1_10] != 0 |
                        this.gravityArray[idx_Y+1][idx_X_2_10] != 0){
                        element.y = idx_Y *this._H;
                    }
                }
            }

            context.save();
            if(this.scale > 1){   
                context.scale(this.scale, this.scale);  
            }
            
            if(element.glint != 0){
                if((element.glint % 2)==0)
                context.globalAlpha = 0.1;
                else context.globalAlpha = 1.0;
            }

            if(element.objectState[0][element.index] * element.reverseImg > 0)
                context.drawImage(image, element.x , element.y);
            else
                this.flipHorizontally(context,image, element.x , element.y);
            
            context.restore();
        }
        this.checkCollision();
    }
   
    newAnimate(id,state,x,y,callback){
        var index =this.objectArray.push(new Animate(id,OBJECT[id],state,x,y,callback))-1;
        return index;
    }

    deleteAnimate(index){
        this.objectArray.callback = function(){};
        this.objectArray.splice(index,1);
    }

    deleteAllAnimate(id){
        var count = -1;
        for (var index = 0; index < this.objectArray.length; index++) {
            if(this.objectArray[index].id == id)this.deleteAnimate(index);
            count++;
        }
        return count;
    }

    setScale(scale){
        this.scale = scale;
    }

    setState(index,state,x,y){
        this.objectArray[index].setState(state,x,y);
    }
    
    getAnimate(index){
        return this.objectArray[index];
    }
    
    setGlint(index,glint){
        this.objectArray[index].setGlint(glint);
    }

    getIndex(id){
        for (var index = 0; index < this.objectArray.length; index++) {
            var element = this.objectArray[index];
            if(id == element.id)return index;
        }
    }

    getCount(id){
        var count = 0;
        for (var index = 0; index < this.objectArray.length; index++) {
            if(id == this.objectArray[index].id)count++;
        }
        return count;
    }

    flipHorizontally(context,img,x,y){
        context.translate(x+img.width,y);
        context.scale(-1,1);
        context.drawImage(img,0,0);
        context.setTransform(1,0,0,1,0,0);
    }

    setGravityArray(gravityArray,_W,_H){
        this.gravityArray = gravityArray;
        this._W = _W;
        this._H = _H;
    }
}
