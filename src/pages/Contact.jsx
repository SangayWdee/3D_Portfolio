import { Suspense, useRef, useState} from "react";
import emailjs from "@emailjs/browser";
import {Canvas} from "@react-three/fiber";
import Fox from "../models/Fox.jsx";
import Loader from "../components/Loader.jsx";
import useAlert from "../hooks/useAlert.jsx";
import Alert from "../components/Alert.jsx";

const Contact = () => {
    const formRef = useRef(null)
    const [form, setForm] = useState({name: '', email: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [currentAnimation, setCurrentAnimation] = useState('idle');
    const {alert, showAlert, hideAlert} = useAlert();

    const handleChange = (e) => {
        //...form, is used to create shallow copy of current state "form"
        setForm({...form, [e.target.name]: e.target.value})
    };

    const handleSubmit = (e) => {
        //prevent default loading
        e.preventDefault();
        setIsLoading(true);
        setCurrentAnimation('hit')

        emailjs.send(
            'service_1egsl8q',
            'template_e48tyvw',
        {
                from_name: form.name,
                to_name: "Sangay",
                from_email: form.email,
                to_email: 'sangay.wangdi@selise.ch',
                message: form.message
             },
            'HBJMNCO8jEXZEdFGh'
        ).then(()=>{
            setIsLoading(false)
            //TODO: show success message
            //TODO: hide an alert
            showAlert({show: true, text: 'Message sent successfully', type: 'success'})

            setTimeout(()=>{
                hideAlert();
                setCurrentAnimation('idle');
                setForm({name: '', email: '', message: ''});
            }, [3000]);
        }).catch((error)=>{
            showAlert({show: true, text: 'I didnt receive your message', type: 'danger'})
            setIsLoading(false);
            setCurrentAnimation('idle');
            console.log(error)
            //TODO: show error message
        })
    };

    const handleFocus = () => setCurrentAnimation('walk');
    const handleBlur = () => setCurrentAnimation('idle');
    return(
        <section className="relative flex lg:flex-row flex-col max-container">
            {alert.show && <Alert {...alert}/>}
            <div className="flex-1 min-w-[50%] flex flex-col">
                <h1 className="head-text">Get in touch</h1>
                <form className="w-full flex flex-col gap-7 mt-14"
                    onSubmit={handleSubmit}
                >
                    <label className="text-black-500 font-semibold">
                        Name
                        <input
                            type="text"
                            name="name"
                            className="input"
                            placeholder="Enter your name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}

                        />
                    </label>
                    <label className="text-black-500 font-semibold">
                        Email
                        <input
                            type="email"
                            name="email"
                            className="input"
                            placeholder="example@gmail.com"
                            required
                            value={form.email}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}

                        />
                    </label>
                    <label className="text-black-500 font-semibold">
                        Your Message
                        <textarea
                            name="message"
                            className="textarea"
                            rows={4}
                            placeholder="Let me know how I can help you!"
                            required
                            value={form.message}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}

                        />
                    </label>
                    <button
                        type="submit"
                        className="btn"
                        disabled={isLoading}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    >
                        {isLoading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
            <div className="lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]">
                {/*fov(field of view): larger fov wider view and smaller the fov more zoomed-in view
                far: distance to the far clipping plane. object further from the camera, this value wont be rendered
                near: distance to the near clipping plane. object closer to the camera, this value wont be rendered*/}
                <Canvas camera={{
                    position: [0,0,5],
                    fov: 75,
                    near: 0.1,
                    far: 1000
                }}>
                    <directionalLight intensity={2.5} position={[0, 0, 1]} />
                    <ambientLight intensity={0.5} />
                    <Suspense fallback={<Loader />}>
                        <Fox
                            currentAnimation={currentAnimation}
                            position={[0.5, 0.35, 0]}
                            rotation={[12.6, -0.6, 0]}
                            scale={[0.5, 0.5, 0.5]}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </section>
    )
}

export default Contact;