# Signalling in P2P File Sharing

## What is the need of a signalling server in a P2P Application?

In a P2P file sharing system, peers need to be able to find each other before they can send files. To do this we need to have a way to identify peers. A signalling server is a server that can be used to exchange this information.

## How does our Signalling server work?

Whenever a `POST` request is created on the `/room` route, a new room is created.

A room has following four fields:

| Sr. No | Name      | Description                                        | Type                         |
| ------ | --------- | -------------------------------------------------- | ---------------------------- |
| 1      | `mKey`    | The master key of the room                         | `string`                     |
| 2      | `cKey`    | The client key of the room                         | `string`                     |
| 3      | `Master`  | A websocket connection to the master peer          | `*websocket.Conn`            |
| 4      | `Clients` | A map of websocket connections to the client peers | `map[string]*websocket.Conn` |

Once a room has been created a `GET` request is made to the `/ws/:room_id` route with the `mKey` for a master or `cKey` for a client as query parameters. If the room exists, the client is added to the room and a websocket connection is established with the client.

## How does the client initialize a websocket connection?

1. The client makes a HTTP request with a Websocket upgrade header with a `room_id` parameter to the "/ws/:room_id" route.
2. The server checks if request is Websocket, if not it returns a 400 for Plain HTTP error.
3. The server then handles websocket request and upgrades the connection to a websocket connection.
4. It closes the connection if the room does not exist
5. If the client is the master peer, it sets the websocket connection to the `Master` field of the room.
6. If the client is a client peer, it adds the websocket connection to the `Clients` map of the room.
