import { useState } from "react";
import CtaButton from "./CtaButton";

export default function Dropper(props: { onSubmit: any, isLoaded: boolean }) {

	const [ files, setFiles ] = useState<File[]>([]);

	return (
		<form>

			<label
				className="block rounded-2xl bg-gray-300 w-full p-10 text-center font-bold uppercase text-xl text-gray-500
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
				<div className="flex gap-2 mt-2 overflow-x-auto">

					{files.map((f) =>
						<div
							key={f.name}
							className="flex flex-col w-max text-center align-center bg-gray-300 rounded-2xl border-2 border-gray-400 px-3 py-2 min-w-max"
						>
							<video src={URL.createObjectURL(f)} width={120}
								className="rounded-2xl mx-auto"
							/>
							<p className="text-xs mt-1">{f.name}</p>
						</div>
					)}

				</div>
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