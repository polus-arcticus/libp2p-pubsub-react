import * as React from 'react'
import { 
  useState,
  useEffect,
  useCallback,
  createContext
} from 'react'

import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify } from '@libp2p/identify'
import { webRTC } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from 'libp2p'
import { fromString, toString } from 'uint8arrays'

export const Libp2pContext = createContext({
  libp2p: null,
  started: false,
  error: null,
})

export const Libp2pProvider = ({ children }) => {
  const [libp2p, setLibp2p] = useState(null)
  const [error, setError] = useState(null)
  const [started, setStarted] = useState(false)

  const startLibp2p = useCallback(async () => {
    try {
      setLibp2p(
        await createLibp2p({
          addresses: {
            listen: [
              // make a reservation on any discovered relays - this will let other
              // peers use the relay to contact us
              '/p2p-circuit',
              // create listeners for incoming WebRTC connection attempts on on all
              // available Circuit Relay connections
              '/webrtc'
            ]
          },
          transports: [
            // the WebSocket transport lets us dial a local relay
            webSockets({
              // this allows non-secure WebSocket connections for purposes of the demo
              filter: filters.all
            }),
            // support dialing/listening on WebRTC addresses
            webRTC(),
            // support dialing/listening on Circuit Relay addresses
            circuitRelayTransport()
          ],
          // a connection encrypter is necessary to dial the relay
          connectionEncrypters: [noise()],
          // a stream muxer is necessary to dial the relay
          streamMuxers: [yamux()],
          connectionGater: {
            denyDialMultiaddr: () => {
              // by default we refuse to dial local addresses from browsers since they
              // are usually sent by remote peers broadcasting undialable multiaddrs and
              // cause errors to appear in the console but in this example we are
              // explicitly connecting to a local node so allow all addresses
              return false
            }
          },
          services: {
            identify: identify(),
            pubsub: gossipsub(),
            dcutr: dcutr()
          }
        })
      )
      setStarted(true)
    } catch (e) {
      console.error(e)
      setError(e)
    }
  }, [])

  useEffect(() => {
    startLibp2p()
  }, [])

  return (
    <Libp2pContext.Provider
      value={{
        libp2p,
        started,
        error
      }}
    >
      {children}
    </Libp2pContext.Provider>
  )
}


