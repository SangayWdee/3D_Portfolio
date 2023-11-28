import {useGLTF} from "@react-three/drei";
import skyScene from "../assets/3d/sky.glb";
import {useRef} from "react";
import {useFrame} from "@react-three/fiber";

const Sky = ({ isRotating }) => {
    //useGLTF used to load GLTF model
    const sky = useGLTF(skyScene);
    const skyRef = useRef();

    useFrame((_, delta) => {
        if(isRotating) {
            skyRef.current.rotation.y += 0.15 * delta;
        }
    })
    return(
        //mesh wraps 3d objects and its materials
        <mesh ref={skyRef}>
            // component that creates a Three.js primitive geometry, like a box or sphere.
            <primitive object={sky.scene} />
        </mesh>
    )
}

export default Sky;