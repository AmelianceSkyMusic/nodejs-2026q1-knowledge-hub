import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';

export class RotatingStream extends Writable {
	private currentStream: fs.WriteStream | null = null;
	private currentSize = 0;
	private currentDate: string;

	constructor(
		private readonly logDir: string,
		private readonly logFile: string,
		private readonly maxSize: number,
	) {
		super();
		this.currentDate = this.getDateString();
		this.ensureDir();
		this.initializeSize();
		this.openStream();
	}

	private getDateString(): string {
		return new Date().toISOString().split('T')[0];
	}

	private ensureDir() {
		if (!fs.existsSync(this.logDir)) {
			fs.mkdirSync(this.logDir, { recursive: true });
		}
	}

	private initializeSize() {
		const filePath = path.join(this.logDir, this.logFile);
		if (fs.existsSync(filePath)) {
			this.currentSize = fs.statSync(filePath).size;
		}
	}

	private openStream() {
		const filePath = path.join(this.logDir, this.logFile);
		this.currentStream = fs.createWriteStream(filePath, { flags: 'a' });

		this.currentStream.on('error', (err) => {
			console.error('Log Stream Error:', err);
		});
	}

	private rotate(reason: 'size' | 'date') {
		if (this.currentStream) {
			this.currentStream.end();
			this.currentStream = null;
		}

		const filePath = path.join(this.logDir, this.logFile);
		if (fs.existsSync(filePath)) {
			const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
			const ext = path.extname(this.logFile);
			const base = path.basename(this.logFile, ext);
			const newPath = path.join(this.logDir, `${base}-${timestamp}${ext}`);

			try {
				fs.renameSync(filePath, newPath);
			} catch (err) {
				console.error(`Failed to rotate log file (${reason}):`, err);
			}
		}

		this.currentSize = 0;
		this.currentDate = this.getDateString();
		this.openStream();
	}

	_write(chunk: Uint8Array | string, _encoding: string, callback: (error?: Error | null) => void) {
		const now = this.getDateString();

		if (now !== this.currentDate) {
			this.rotate('date');
		} else if (this.currentSize + chunk.length > this.maxSize) {
			this.rotate('size');
		}

		if (this.currentStream) {
			this.currentSize += chunk.length;
			this.currentStream.write(chunk, callback);
		} else {
			callback(new Error('Log stream is closed'));
		}
	}

	_final(callback: (error?: Error | null) => void) {
		if (this.currentStream) {
			this.currentStream.end(callback);
		} else {
			callback();
		}
	}
}
