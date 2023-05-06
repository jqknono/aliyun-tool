const OSS = require('ali-oss');

async function deleteAllRecursive(bucket) {
    var sucCount = 0;
    var failCount = 0;
    // 不带任何参数，默认最多返回100个文件。
    var results = await client.list();

    while (results.objects.length > 0) {
        for (let i = 0; i < results.objects.length; i++) {
            const object = results.objects[i];
            try {
                await client.delete(object.name);
                console.log('delete %s successfully', object.name);
                sucCount++;
            } catch (err) {
                console.log(err);
                failCount++;
            }
        }

        results = await client.list();
    }

    console.log('delete %d files successfully', sucCount);
    console.log('delete %d files failed', failCount);
}

async function getBuckets(client) {
    try {
        // 列举当前账号所有地域下的存储空间。
        const results = await client.listBuckets();
        for (let i = 0; i < results.buckets.length; i++) {
            const bucket = results.buckets[i];
            console.log(bucket);
            // await deleteBucket(client, bucket.name);
        }

        return results.buckets;
    } catch (err) {
        console.log(err);
    }
}


function getNewOSSClient(region, accessKeyId, accessKeySecret, bucketName) {
    try {
        return new OSS({
            region: region,
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            bucket: bucketName
        });
    }
    catch (err) {
        console.log(err);
        return null;
    }
}


// check args
if (process.argv.length < 5) {
    console.log('\x1b[36m%s\x1b[0m', 'Usage: node delete_all_from_bucket.js <region> <accessKeyId> <accessKeySecret> <bucketName>');
    process.exit(-1);
}

// get args
const region = process.argv[2];
const accessKeyId = process.argv[3];
const accessKeySecret = process.argv[4];
const bucketName = process.argv[5];

const client = getNewOSSClient(region, accessKeyId, accessKeySecret, bucketName);

if (client) {
    deleteAllRecursive(client);
} else {
    console.log('\x1b[31m%s\x1b[0m','create client failed');
    console.log('\x1b[31m%s\x1b[0m','Check your args');
    console.log('\x1b[36m%s\x1b[0m','Usage: node delete_all_from_bucket.js <region> <accessKeyId> <accessKeySecret> <bucketName>');
}