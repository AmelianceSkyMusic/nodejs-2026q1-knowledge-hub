import * as request from 'supertest';
import 'dotenv/config';

const port = process.env.PORT || 4000;

const host = `localhost:${port}`;
const _request = request(host);

const testRequest = {
	get: (url: string) => _request.get(url).set('x-test-mode', 'true'),
	post: (url: string) => _request.post(url).set('x-test-mode', 'true'),
	put: (url: string) => _request.put(url).set('x-test-mode', 'true'),
	delete: (url: string) => _request.delete(url).set('x-test-mode', 'true'),
	patch: (url: string) => _request.patch(url).set('x-test-mode', 'true'),
};

export default testRequest;
