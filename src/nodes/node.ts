import bodyParser from "body-parser";
import express from "express";
import { BASE_NODE_PORT } from "../config";
import { Value } from "../types";


export async function node(
  nodeId: number, // the ID of the node
  N: number, // total number of nodes in the network
  F: number, // number of faulty nodes in the network
  initialValue: Value, // initial value of the node
  isFaulty: boolean, // true if the node is faulty, false otherwise
  nodesAreReady: () => boolean, // used to know if all nodes are ready to receive requests
  setNodeIsReady: (index: number) => void // this should be called when the node is started and ready to receive requests
) {
  const node = express();
  node.use(express.json());
  node.use(bodyParser.json());

  let state = {
    killed: false,
    x: initialValue,
    decided: false,
    k: 0
  };


  // TODO implement this
  // this route allows retrieving the current status of the node
  // node.get("/status", (req, res) => {});
  node.get("/status", (req, res) => {
    if (isFaulty) {
      res.status(500).send("faulty");
    } else {
      res.status(200).send("live");
    }
  });


  // TODO implement this
  // this route allows the node to receive messages from other nodes
  // node.post("/message", (req, res) => {});

// Message handler route
  node.post("/message", (req, res) => {
    if (!isFaulty && !state.killed) {
      const message = req.body;
      // Process message based on Ben-Or logic
      // Update state based on the message

      res.status(200).send("Message received");
    } else {
      res.status(500).send("Node is faulty or stopped");
    }
  });



  // TODO implement this
  // this route is used to start the consensus algorithm
  // node.get("/start", async (req, res) => {});
  node.get("/start", async (req, res) => {
    if (!isFaulty && !state.killed) {
      // Implement logic to start the consensus process
      // This might involve sending initial messages to other nodes, setting initial state, etc.

      res.send("Consensus started");
    } else {
      res.status(500).send("Node is faulty or stopped");
    }
  });


  // TODO implement this
  // this route is used to stop the consensus algorithm
  // node.get("/stop", async (req, res) => {});
  node.get("/start", async (req, res) => {
    if (!isFaulty && !state.killed) {
      // Implement logic to start the consensus process
      // This might involve sending initial messages to other nodes, setting initial state, etc.

      res.send("Consensus started");
    } else {
      res.status(500).send("Node is faulty or stopped");
    }
  });


  // TODO implement this
  // get the current state of a node
  // node.get("/getState", (req, res) => {});
  node.get("/getState", (req, res) => {
    if (isFaulty) {
      res.json({ killed: true, x: null, decided: null, k: null });
    } else {
      // Assuming you have variables to keep track of the state
      res.json(state);
    }
  });



  // start the server
  const server = node.listen(BASE_NODE_PORT + nodeId, async () => {
    console.log(
      `Node ${nodeId} is listening on port ${BASE_NODE_PORT + nodeId}`
    );

    // the node is ready
    setNodeIsReady(nodeId);
  });

  return server;
}
