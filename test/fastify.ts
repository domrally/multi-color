import Static from '@fastify/static'
import Fastify from 'fastify'
import path from 'path'
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
console.log(__dirname)
Fastify()
	.register(Static, {
		root: path.join(__dirname, '../docs'),
	})
	.listen({ port: 3000 }, (_, address) =>
		console.log(`Server is now listening on ${address}`)
	)
