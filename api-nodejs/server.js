const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Send Payment Endpoint
app.post('/send_payment', (req, res) => {
    const { from, to, amount, message } = req.body;

    console.log('Received Request Data:', req.body);

    const command = `
        stellar contract invoke \\
            --id GBITKHBTSONL7BUHIMEA3YBFWE4X4TZYKGVBFFGVSYDMAZ6K63EVCSVO \\
            --source GBITKHBTSONL7BUHIMEA3YBFWE4X4TZYKGVBFFGVSYDMAZ6K63EVCSVO \\
            --network testnet \\
            --send=yes \\
            -- send_payment \\
            --from ${from} \\
            --to ${to} \\
            --amount ${parseInt(amount)} \\
            --message "${message.replace(/\"/g, '\\"')}"
    `;

    console.log('Executing Command:', command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({
                code: error.code,
                killed: error.killed,
                signal: error.signal,
                cmd: error.cmd,
                message: error.message,
            });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.status(200).json({ output: stdout || stderr });
    });
});

// Get Balance Endpoint
app.post('/get_balance', (req, res) => {
    const { address } = req.body;

    console.log('Received Request Data:', req.body);

    const command = `
        stellar contract invoke \\
            --id [CONTRACT_ID] \\
            --source ${address} \\
            --network testnet \\
            --send=yes \\
            -- get_balance \\
            --address ${address}
    `;

    console.log('Executing Command:', command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({
                code: error.code,
                killed: error.killed,
                signal: error.signal,
                cmd: error.cmd,
                message: error.message,
            });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.status(200).json({ output: stdout || stderr });
    });
});

// Get Transaction History Endpoint
app.post('/get_transaction_history', (req, res) => {
    const { address } = req.body;

    console.log('Received Request Data:', req.body);

    const command = `
        stellar contract invoke \\
            --id [CONTRACT_ID] \\
            --source ${address} \\
            --network testnet \\
            --send=yes \\
            -- get_transaction_history \\
            --address ${address}
    `;

    console.log('Executing Command:', command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({
                code: error.code,
                killed: error.killed,
                signal: error.signal,
                cmd: error.cmd,
                message: error.message,
            });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.status(200).json({ output: stdout || stderr });
    });
});

// Schedule Payment Endpoint
app.post('/schedule_payment', (req, res) => {
    const { from, to, amount, message, interval } = req.body;

    console.log('Received Request Data:', req.body);

    const command = `
        stellar contract invoke \\
            --id [CONTRACT_ID] \\
            --source ${from} \\
            --network testnet \\
            --send=yes \\
            -- schedule_payment \\
            --from ${from} \\
            --to ${to} \\
            --amount ${parseInt(amount)} \\
            --message "${message.replace(/\"/g, '\\"')}" \\
            --interval ${parseInt(interval)}
    `;

    console.log('Executing Command:', command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({
                code: error.code,
                killed: error.killed,
                signal: error.signal,
                cmd: error.cmd,
                message: error.message,
            });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.status(200).json({ output: stdout || stderr });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
