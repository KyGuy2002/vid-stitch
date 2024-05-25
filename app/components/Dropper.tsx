import { useEffect, useState } from "react";
import CtaButton from "./CtaButton";
import ThumbnailBox from "./ThumbnailBox";
import getVideoCover from "~/utils/thumbnail";

export default function Dropper(props: { onSubmit: any, isLoaded: boolean }) {

	const [ files, setFiles ] = useState<File[]>([]);
	const [ thumbs, setThumbs ] = useState<string[]>([]);

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

	return (
		<form>

			<label
				className="block rounded-2xl bg-gray-300 w-full p-8 text-center font-bold uppercase text-xl text-gray-500
				border-dashed border-4 border-gray-400 cursor-pointer"
				htmlFor="file-upload"
			>

				Click here to select

			</label>

			<input style={{ display: "none" }} type="file" id="file-upload" name="files" multiple onChange={(evt) => {
				if (evt.target.files?.length == 0) return;
				setFiles((f) => [...f, ...Array.from(evt.target.files!)]);
			}}/>

			{files &&
				<>{ // 10 or less files displays gallery
					files.length <= 10 &&
						<div className="flex gap-2 mt-2 overflow-x-auto hide-scrollbar">

							{files.map((f, i) =>
								<ThumbnailBox key={f.name} name={f.name} thumb={thumbs[i]}/>
							)}

						</div>
				}
				{ // More than 10 just says total with 1 thumbnail
					files.length > 10 &&
						<p className="font-semibold text-sm mt-1.5">{files.length} files selected</p>
				}
				</>
			}

			{(props.isLoaded && (files && files.length > 1)) && 
				<CtaButton text="Stitch" onClick={() => props.onSubmit(files)}/>
			}

			{!props.isLoaded &&
				<CtaButton text="Downloading Code" disabled={true}/>
			}

			{(props.isLoaded && (!files || files?.length <= 1)) &&
				<CtaButton text="Select Files" disabled={true}/>
			}

			<p className="mt-3 text-sm">All files must be same type, resolution, and length</p>

		</form>
	);


}