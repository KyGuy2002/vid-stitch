// Source: https://stackoverflow.com/a/53058574/12947009

// Drop handler function to get all files
export default async function getAllFileEntries(dataTransferItemList: DataTransferItemList): Promise<File[]> {
	let fileEntries: File[] = [];
	// Use BFS to traverse entire directory/file structure
	let queue = [];
	// Unfortunately dataTransferItemList is not iterable i.e. no forEach
	for (let i = 0; i < dataTransferItemList.length; i++) {
		// Note webkitGetAsEntry a non-standard feature and may change
		// Usage is necessary for handling directories
		queue.push(dataTransferItemList[i].webkitGetAsEntry());
	}
	while (queue.length > 0) {
		let entry: any = queue.shift();
		if (entry!.isFile) {
			fileEntries.push((await getFile(entry))!);
		} else if (entry!.isDirectory) {
			queue.push(...await readAllDirectoryEntries(entry!.createReader()));
		}
	}
	return fileEntries;
}
  
// Get all the entries (files or sub-directories) in a directory 
// by calling readEntries until it returns empty array
async function readAllDirectoryEntries(directoryReader: FileSystemDirectoryReader) {
	let entries = [];
	let readEntries: any = await readEntriesPromise(directoryReader);
	while (readEntries.length > 0) {
		entries.push(...readEntries);
		readEntries = await readEntriesPromise(directoryReader);
	}
	return entries;
}

// Wrap readEntries in a promise to make working with readEntries easier
// readEntries will return only some of the entries in a directory
// e.g. Chrome returns at most 100 entries at a time
async function readEntriesPromise(directoryReader: FileSystemDirectoryReader) {
	try {
		return await new Promise((resolve, reject) => {
			directoryReader.readEntries(resolve, reject);
		});
	} catch (err) {
		console.log(err);
	}
}

async function getFile(fileEntry: FileSystemFileEntry): Promise<File | undefined> {
	try {
	  return new Promise((resolve, reject) => fileEntry.file(resolve, reject));
	} catch (err) {
	  console.log(err);
	}
}