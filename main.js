
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.autoClearColor = false;

  const camera = new THREE.OrthographicCamera(
    -1, // left
     1, // right
     1, // top
    -1, // bottom
    -1, // near,
     1, // far
  );
  const scene = new THREE.Scene();
  const plane = new THREE.PlaneGeometry(2, 2);

  const loader = new THREE.TextureLoader();
  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/bayer.png');
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
    iChannel0: { value: texture },
  };

  function convertShaderToyToThreejs(s)
  {
      return `
        uniform vec3 iResolution; //Done: viewport resolution (in pixels)
        uniform float iTime; //Done: shader playback time (in seconds)
        uniform float iTimeDelta; //Done: render time (in seconds)
        uniform int iFrame; //Done: shader playback frame

        uniform float iChannelTime[4]; //Wont Do now: channel playback time (in seconds)
        uniform vec3 iChannelResolution[4]; // channel resolution (in pixels)
        uniform vec4 iMouse; // mouse pixel coords. xy: current (if MLB down), zw: click
        //uniform samplerXX iChannel0..3; // input channel. XX = 2D/Cube
        uniform sampler2D iChannel0; // input channel. XX = 2D/Cube
        uniform sampler2D iChannel1; // input channel. XX = 2D/Cube
        uniform sampler2D iChannel2; // input channel. XX = 2D/Cube
        uniform sampler2D iChannel3; // input channel. XX = 2D/Cube
        uniform vec4 iDate; //Do (year, month, day, time in seconds)
        uniform float iSampleRate; //Wont Do sound sample rate (i.e., 44100)

        varying vec2 vUv;

        ${s}

        void main()
        {
            vec4 c;
            vec2 uv = gl_FragCoord.xy;
            mainImage(c, uv);
            gl_FragColor = c;
        }

      `
  }

  fetch('./shaders/molten.rock.fs')
  .then(res=>res.text())
  .then(fragmentShader=>{
      fragmentShader = convertShaderToyToThreejs(fragmentShader)
      console.log(fragmentShader)
      const material = new THREE.ShaderMaterial({
      fragmentShader,
      uniforms,
        });
     scene.add(new THREE.Mesh(plane, material));
  })
  .catch(err=>{
      console.log(err)
      }) ;

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;  // convert to seconds

    resizeRendererToDisplaySize(renderer);

    const canvas = renderer.domElement;
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.iTime.value = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();

