import { useEffect, useRef, useState } from "react";
import CtaButton from "./CtaButton";
import ThumbnailBox from "./ThumbnailBox";
import getVideoCover from "~/utils/thumbnail";
import getAllFileEntries from "~/utils/dragndrop";

export default function Dropper(props: { onSubmit: any, isLoaded: boolean }) {

	const [ files, setFiles ] = useState<File[]>([]);
	const [ thumbs, setThumbs ] = useState<string[]>([]);
	const inputRef = useRef<HTMLInputElement>();
	const dropAreaRef = useRef<HTMLDivElement>();

	// Sequentially process the thumbnails to avoid crashing
	useEffect(() => {
		async function handle() {

			for (let i = 0; i < files.length; i++) {
				const url = URL.createObjectURL(await getVideoCover(files[i]));
				setThumbs((t) => [...t, url])
			}
		}
		setThumbs((t) => []);
		if (files.length <= 10) handle(); // Only do thumbnails if 10 or less
	}, [files])

	useEffect(() => {
		if (!inputRef.current) return;
		inputRef.current.setAttribute("directory", "");
		inputRef.current.setAttribute("webkitdirectory", "");
	}, [inputRef])
	
	function getSize() {
		let total = 0;
		for (let i = 0; i < files.length; i++) {
			total = total + ((files[i].size / 1048576) / 1024);
		}
		return total;
	}

	return (
		<form>

			<label
				ref={dropAreaRef}
				className="rounded-2xl bg-gray-300 w-full px-4 py-7
				border-dashed border-2 border-gray-400 cursor-pointer flex flex-col align-center justify-center gap-2"
				htmlFor="file-picker"

				onDragEnter={(e) => {
					e.preventDefault();
					e.stopPropagation();
					dropAreaRef.current!.style.backgroundColor = "#dbeafe"
				}}
				onDragOver={(e) => {
					e.preventDefault();
					e.stopPropagation();
					dropAreaRef.current!.style.backgroundColor = "#dbeafe"
				}}
				onDragLeave={(e) => {
					e.preventDefault();
					e.stopPropagation();
					dropAreaRef.current!.style.backgroundColor = ""
				}}
				onDrop={async (e) => {
					e.preventDefault();
					e.stopPropagation();
					dropAreaRef.current!.style.backgroundColor = ""

					const files = await getAllFileEntries(e.dataTransfer.items);
					setFiles((f) => [...f, ...Array.from(files)]);
				}}

			>

				<img src="/fontawesome/file-arrow-up-solid.svg" className="w-7 mx-auto"/>

				<p className="text-gray-500 font-bold uppercase text-xl">Drag 'n' Drop here</p>

				<div className="flex mx-auto gap-4 mt-3">
					<label className="rounded-2xl border-blue-800 border-2 w-max px-5 py-1 text-blue-800 font-bold hover:bg-blue-300 cursor-pointer">
						Add Folder

						<input ref={inputRef} style={{ display: "none" }} type="file" multiple onChange={(evt) => {
							if (evt.target.files?.length == 0) return;
							setFiles((f) => [...f, ...Array.from(evt.target.files!)]);
						}}/>

					</label>
					<label className="rounded-2xl border-blue-800 border-2 w-max px-5 py-1 text-blue-800 font-bold hover:bg-blue-300 cursor-pointer">
						Add Files
						
						<input style={{ display: "none" }} type="file" id="file-picker" multiple onChange={(evt) => {
							if (evt.target.files?.length == 0) return;
							setFiles((f) => [...f, ...Array.from(evt.target.files!)]);
						}}/>

					</label>
				</div>

			</label>

			{files && files.length > 0 && files.length <= 10 && // 10 or less files displays gallery
				<div className="flex gap-2 mt-2 overflow-x-auto hide-scrollbar">

					{files.map((f, i) =>
						<ThumbnailBox key={f.name} name={f.name} thumb={thumbs[i]}/>
					)}

				</div>
			}

			<p className='font-semibold text-sm mt-4'>{files.length} files selected - {getSize().toFixed(2)} GB total (1.8 GB max)</p>

			{getSize() > 1.80 &&
				<p className="text-red-700 mt-3 text-lg font-bold">Files exceed 1.8 GB max size</p>	
			}

			{(props.isLoaded && (files && files.length > 1) && (getSize() <= 1.80)) && 
				<CtaButton text="Stitch" onClick={() => props.onSubmit(files)}/>
			}

			{!props.isLoaded &&
				<p className="mt-3 text-md font-bold">Downloading FFmpeg...  Please wait.</p>
			}

			<p className="mt-3 text-sm">All files must be same type and resolution.  1.8 GB max total.</p>
			<p className="text-sm">(4 days of Wyze SD card footage)</p>

		</form>
	);


}