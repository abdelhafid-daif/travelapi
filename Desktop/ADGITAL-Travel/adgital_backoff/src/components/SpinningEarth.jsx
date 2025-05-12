import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const SpinningEarth = () => {
  const containerRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, windowSize.width / windowSize.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(windowSize.width, windowSize.height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);

    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Earth_map.jpg/800px-Earth_map.jpg');

    // Create the Earth geometry
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Points material (light gray)
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xeeeeee, // Light color for the points
      size: 0.1, // Point size
      opacity: 0.8,
      transparent: true,
    });

    // Geometry for points
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = [];
    const pointCount = 2000; // Increase the number of points to make it more detailed

    // Create random points uniformly distributed on the sphere
    for (let i = 0; i < pointCount; i++) {
      const lat = Math.random() * Math.PI - Math.PI / 2; // Latitude: -π/2 to π/2
      const lon = Math.random() * 2 * Math.PI - Math.PI; // Longitude: -π to π

      // Convert spherical coordinates to Cartesian coordinates
      const x = 5 * Math.cos(lat) * Math.cos(lon);
      const y = 5 * Math.cos(lat) * Math.sin(lon);
      const z = 5 * Math.sin(lat);

      positions.push(x, y, z);
    }

    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    camera.position.z = 15;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);

    // Point light to simulate sunlight
    const pointLight = new THREE.PointLight(0xffffff, 2, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);

      // Rotate the Earth and points
      earth.rotation.y += 0.005;
      points.rotation.y += 0.005;

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      geometry.dispose();
      material.dispose();
      pointsMaterial.dispose();
      pointsGeometry.dispose();
      renderer.dispose();
    };
  }, [windowSize]);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};
export default SpinningEarth;
