import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import Dropper from "./Dropper";
import CtaButton from "./CtaButton";
import { ProgressType } from "./ProgressType";

export default function FileUpload() {
	const [ stage, setStage ] = useState("LOADING_FFMPEG");
	const [ error, setError ] = useState();
	const [ clipNo, setClipNo ] = useState<number>(0);
	const [ totalClips, setTotalClips ] = useState<number>(0);
	const [ finalBlob, setFinalBlob ] = useState<string>();
	const ffmpegRef = useRef(new FFmpeg());


	// TODO load again after terminate?
	async function loadFFmpeg() {
		const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'
		const ffmpeg = ffmpegRef.current;
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
			workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
		});
		setStage("WAIT_PICK")
	}


	async function concat(files: File[]) {
		const ffmpeg = ffmpegRef.current;
		setTotalClips(files.length);


		// Setup logger
		setClipNo((i) => 0);
		ffmpeg.on('log', ({ message }) => {
			if (message.includes("Auto-inserting")) {
				setClipNo((i) => i+1);
			}
        });


		try {
			setStage("LOADING_FILES")


			let str = "";
			console.log("Loading files into VFS...")
			let n = 0;
			for (let i = 0; i < files.length; i++) {
				str = str + `file 'input${i}.mp4'\n`;

				// Write file
				const url = URL.createObjectURL(files[i]);
				await ffmpeg.writeFile(`input${i}.mp4`, await fetchFile(url));
				URL.revokeObjectURL(url);

				setClipNo((i) => i+1);

				n++;
			}
			setClipNo((i) => 0);

			setStage("PROCESSING")

			console.log("Starting Processing...")

			await ffmpeg.writeFile('list.txt', str);
			await ffmpeg.exec(['-f', 'concat', '-i', 'list.txt', '-c', 'copy', 'output.mov']);


			const data: any = await ffmpeg.readFile("output.mov")
			ffmpeg.terminate();
			
			setFinalBlob(URL.createObjectURL(new Blob([data.buffer], {type: 'video/mov'})));

			setStage("DONE")
			console.log("Done!")
		} catch (e: any) {
			setError(e);
			ffmpeg.terminate();
		}
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

				{(stage == "PROCESSING" || stage == "LOADING_FILES") &&
					<>
						{!error && <>
							<p className="font-bold text-lg">Video Processing</p>
							<p className="mb-8">Your device is currently processing the video locally.</p>

							<div className="bg-blue-100 rounded-3xl p-5 flex flex-col gap-2 mb-5">

								<ProgressType label="Loading Files" current={clipNo} total={totalClips} done={stage == "PROCESSING"} notStarted={false}/>
								<ProgressType label="Processing" current={clipNo} total={totalClips} done={clipNo == totalClips} notStarted={stage == "LOADING_FILES"}/>
								<ProgressType label="Finishing Up" current={clipNo} total={totalClips} done={false} notStarted={clipNo != totalClips}/>

							</div>

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