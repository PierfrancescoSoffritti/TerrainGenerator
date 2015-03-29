// initialises controls as disabled 
var controlsEnabled = false;

// idle
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var moveUp = false;
var moveDown = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
console.log("havePointerLock: " +havePointerLock);

function setMyPointerLock() {

  var blocker = document.getElementById( 'blocker' );
  var instructions = document.getElementById( 'instructions' );

  if ( havePointerLock ) {
    var element = document.body;
    // this is an event listener
    var pointerlockchange = function ( event ) {
      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

        controlsEnabled = true; // keyboard
        controls.enabled = true; // mouse

        blocker.style.display = 'none'; // removes dark layer

      } else {

        controls.enabled = false;
        blocker.style.display = '-webkit-box';
        blocker.style.display = '-moz-box';
        blocker.style.display = 'box';

        instructions.style.display = '';
      }
    }

    var pointerlockerror = function ( event ) {
      instructions.style.display = '';
    }

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {
      instructions.style.display = 'none';

      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
      if ( /Firefox/i.test( navigator.userAgent ) ) {
        // this is an event listener
        var fullscreenchange = function ( event ) {
          if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
            document.removeEventListener( 'fullscreenchange', fullscreenchange );
            document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

            element.requestPointerLock();
          }
        }

        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
        element.requestFullscreen();
      } else {
        element.requestPointerLock();
      }
    }, false );

  } else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
  }

  // listener
    var onKeyDown = function ( event ) {
      switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
          moveForward = true;
          break;

        case 37: // left
        case 65: // a
          moveLeft = true; break;

        case 40: // down
        case 83: // s
          moveBackward = true;
          break;

        case 39: // right
        case 68: // d
          moveRight = true;
          break;

        case 82: // page up
          moveUp = true;
          break;
        case 70: // page down
          moveDown = true;
          break;

        case 32: // space
          if ( canJump === true ) velocity.y += 350;
          canJump = false;
          break;
      }
    };

    // listener
    var onKeyUp = function ( event ) {
      switch( event.keyCode ) {
        case 38: // up
        case 87: // w
          moveForward = false;
          break;

        case 37: // left
        case 65: // a
          moveLeft = false;
          break;

        case 40: // down
        case 83: // s
          moveBackward = false;
          break;

        case 39: // right
        case 68: // d
          moveRight = false;
          break;

        case 82: // page up
          moveUp = false;
          break;
        case 70: // page down
          moveDown = false;
          break;

      }
    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

}

function updateControls() {
  if ( controlsEnabled ) {

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= velocity.y * 10.0 * delta;

    
    if ( moveForward ) velocity.z -= 150.0 * delta;
    if ( moveBackward ) velocity.z += 150.0 * delta;

    if ( moveLeft ) velocity.x -= 150.0 * delta;
    if ( moveRight ) velocity.x += 150.0 * delta;

    if( moveUp ) velocity.y += 150.0 * delta;
    if( moveDown ) velocity.y -= 150.0 * delta;

    controls.getObject().translateX( velocity.x * delta );
    controls.getObject().translateY( velocity.y * delta );
    controls.getObject().translateZ( velocity.z * delta );

    prevTime = time;

    }
}