import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import Dropper from "./Dropper";
import CtaButton from "./CtaButton";

export default function FileUpload() {
	const [ stage, setStage ] = useState("LOADING_FFMPEG");
	const [ error, setError ] = useState();
	const [ clipNo, setClipNo ] = useState<number>();
	const [ finalBlob, setFinalBlob ] = useState<string>();
	const ffmpegRef = useRef(new FFmpeg());


	async function loadFFmpeg() {
		const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm'
		const ffmpeg = ffmpegRef.current;

		let n = 0;
		ffmpeg.on('log', ({ message }) => {
			if (message.includes("Auto-inserting")) {
				console.log("Starting clip: " + n)
				if (n > 0) {
					console.log("Deleting finished file: " + (n-1));
					ffmpeg.deleteFile(`input${n-1}.mp4`);
				}
				n++;
			}
        });

		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
		});
		setStage("WAIT_PICK")
	}


	async function concat(files: File[]) {
		const ffmpeg = ffmpegRef.current;
		try {
			setStage("PROCESSING")


			let str = "";
			console.log("Loading files into VFS...")
			let n = 0;
			for (let i = 0; i < files.length; i++) {
				console.log("Loading clip: " + n);
 
				str = str + `file 'input${i}.mp4'\n`;

				await writeFile(ffmpeg, files, n);
				n++;
			}
			console.log("Loaded all clips.  Starting Processing...")

			await ffmpeg.writeFile('list.txt', str);
			await ffmpeg.exec(['-f', 'concat', '-i', 'list.txt', '-c', 'copy', 'output.mov']);


			console.log("1-STAGE!!!!!!!")
			const data: any = await ffmpeg.readFile("output.mov")
			ffmpeg.terminate();
			console.log("2-STAGE!!!!!!!")
			
			setFinalBlob(URL.createObjectURL(new Blob([data.buffer], {type: 'video/mov'})));
			console.log("3-STAGE!!!!!!!")

			setStage("DONE")
			console.log("Done!")
		} catch (e: any) {
			// setError(e);
			console.log(e)
			ffmpeg.terminate();
		}
	}


	async function writeFile(ffmpeg: FFmpeg, files: File[], i: number) {
		const url = URL.createObjectURL(files[i]);
		await ffmpeg.writeFile(`input${i}.mp4`, await fetchFile(url));
		URL.revokeObjectURL(url);
	}


	useEffect(() => {
		loadFFmpeg();
	}, [])


	return (
		<>

			<div
				className="bg-sky-200 p-8 rounded-3xl text-center"
			>

				{(stage == "LOADING_FFMPEG" || stage == "WAIT_PICK") &&
					<Dropper onSubmit={(files: File[]) => concat(files)} isLoaded={stage != "LOADING_FFMPEG"}/>
				}

				{stage == "PROCESSING" &&
					<>
						{!error && <>
							<p className="font-bold text-lg">Video Processing</p>
							<p className="mb-8">Your device is currently processing the video locally.</p>
							<CtaButton text="Cancel" sub={true} onClick={() => window.location.reload()}/>
						</>}
						{error && <>
							<p className="font-bold text-lg">Something Went Wrong</p>
							<p>An unknown error has occurred.  Please try again, and ensure your files are of the same type, resolution, and length.</p>
							<p className="font-semibold mt-3 mb-8">{error}</p>
							<CtaButton text="Start Over" sub={true} onClick={() => window.location.reload()}/>
						</>}
					</>
				}

				{stage == "DONE" &&
					<>
						<video src={finalBlob} controls autoPlay className="rounded-xl w-full"/>
						<CtaButton text="Save" onClick={() => download()}/>
						<CtaButton text="Start Over" sub={true} onClick={() => window.location.reload()}/>
					</>
				}

			</div>

		</>
	);


	async function download() {
		const tempLink = document.createElement('a');
		tempLink.href = finalBlob!;
		tempLink.setAttribute('download', 'vidstitch-'+Date.now()+".mov");
		tempLink.click();
	}


}