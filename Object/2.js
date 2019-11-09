OBJECT[ID.BUBBLE] = {
    IMG:7,
    FIRE:[
    [0,0,0,1,2],//image
    [15,10,10,10,15],//x
    [0,0,0,0,0],//y
    ],
    LEFT:[
    [3],//image
    [-5],//x
    [0],//y
    ],
    RIGHT:[
    [3],//image
    [5],//x
    [0],//y
    ],
    UP:[
    [3],//image
    [0],//x
    [-5],//y
    ],
    DOWN:[
    [3],//image
    [0],//x
    [5],//y
    ],
    DIE:[
    [5,6],//image
    [0,0],//x
    [-5,-5],//y
    ],
};


function callBackBubble(type,indexA,indexB){
    var bubble_ani = _aniCon.getAnimate(indexA);
    var bubble_aniB = _aniCon.getAnimate(indexB);
    switch (type) {
        case AnimateContainer.END_FRAME:
            _aniCon.setState(indexA,STATE[ID.BUBBLE].RIGHT,bubble_ani.x,bubble_ani.y);
        break;
        case AnimateContainer.NEXT_FRAME:
            if(bubble_ani.state == STATE[ID.BUBBLE].FIRE)break;
            var idx_X=parseInt(bubble_ani.x /_W);
            var idx_Y=parseInt(bubble_ani.y /_H);
            if(_bg_data2[idx_Y][idx_X] == L){
                bubble_ani.reverseX = 1;
                _aniCon.setState(indexA,STATE[ID.BUBBLE].LEFT,bubble_ani.x,bubble_ani.y);
            }
            else if(_bg_data2[idx_Y][idx_X] == R){
                bubble_ani.reverseX = 1;
                _aniCon.setState(indexA,STATE[ID.BUBBLE].RIGHT,bubble_ani.x,bubble_ani.y);
            }
            else if(_bg_data2[idx_Y][idx_X] == U){
                _aniCon.setState(indexA,STATE[ID.BUBBLE].UP,bubble_ani.x,bubble_ani.y);
            }
            else if(_bg_data2[idx_Y][idx_X] == D){
                _aniCon.setState(indexA,STATE[ID.BUBBLE].DOWN,bubble_ani.x,bubble_ani.y);
            }
        break;
        case AnimateContainer.COLLISION:    
        break;
    }
}