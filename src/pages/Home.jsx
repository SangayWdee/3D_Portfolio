import Loader from "../components/Loader.jsx";
import {Suspense, useState, useEffect, useRef} from "react";
import {Canvas} from "@react-three/fiber";
import Island from "../models/Island.jsx";
import Sky from "../models/Sky.jsx";
import Bird from "../models/Bird.jsx";
import Plane from "../models/Plane.jsx";
import HomeInfo from "../components/HomeInfo.jsx";
import sakura from "../assets/sakura.mp3"
import {soundoff, soundon} from "../assets/icons/index.js";

const Home = () => {
    const audioRef = useRef(new Audio(sakura));
    audioRef.current.volume = 0.4;
    audioRef.current.loop = true;
    const [isPlayingMusic, setIsPlayingMusic] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);

    useEffect(()=>{
        if(isPlayingMusic) {
            audioRef.current.play();
        }

        return () => {
            audioRef.current.pause();
        }
    }, [isPlayingMusic]);

    const adjustIslandForScreenSize = () => {
        let screenScale = null;
        let screenPosition = [0, -6.5, -43];
        let rotation = [0.1, 4.7, 0];

        if(window.innerWidth < 768) {
            screenScale = [0.9, 0.9, 0.9];
        } else {
            screenScale = [1, 1, 1];
        }

        return [screenScale, screenPosition, rotation];
    }

    const adjustPlaneForScreenSize = () => {
        let screenScale, screenPosition;

        if(window.innerWidth < 768) {
            screenScale = [1.5, 1.5, 1.5];
            screenPosition =[0, -1.5, 0]
        } else {
            screenScale = [2, 2, 2];
        }

        return [screenScale, screenPosition];
    }

    const [islandScale, islandPosition, islandRotation] = adjustIslandForScreenSize();
    const [planeScale, planePosition] = adjustPlaneForScreenSize();
    return(
        <section className="w-full h-screen relative">
             <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
                 {/*renders homeinfo component only if currentStage is true*/}
                 {currentStage && <HomeInfo currentStage={currentStage} />}
            </div>
            <Canvas className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
                    camera={{near: 0.1, far: 1000}}
            >
                //renders loader
                <Suspense fallback={<Loader />}>
                    //simulates the light that is coming from the distance source like sun
                    <directionalLight position={[1, 1, 1]} intensity={2} />
                    //cast lights from all directions without causing shadow
                    <ambientLight intensity={0.5}/>
                    //cast light to all direction from single point, but its not needed here
                    //used to simulate light bulbs
                    {/*<pointLight />*/}
                    //cast light to all direction from a single point but in the shape of corn, not needed here
                    //used to simulate focused beams of lights, as flashlights, spotlight
                    {/*<spotLight />*/}
                    //illuminate the scene with gradient
                    //simulates lights coming from sky and second light coming from ground
                    //often used for outdoor scenes to provide more realistic lighting env
                    <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />

                    <Bird isRotating={isRotating}/>
                    <Sky isRotating={isRotating} />
                    <Island
                        position={islandPosition}
                        scale={islandScale}
                        rotation={islandRotation}
                        isRotating={isRotating}
                        setIsRotating={setIsRotating}
                        setCurrentStage={setCurrentStage}
                    />
                    <Plane
                        position={planePosition}
                        scale={planeScale}
                        isRotating={isRotating}
                        rotation={[0, 20, 0]}
                    />
                </Suspense>
            </Canvas>
            <div className="absolute bottom-2 left-2">
                <img src={!isPlayingMusic ? soundoff : soundon} alt="sound"
                    className="w-10 h-10 cursor-pointer object-contain"
                     onClick={() => {setIsPlayingMusic(!isPlayingMusic)}}
                />
            </div>
        </section>
    )
}

export default Home;