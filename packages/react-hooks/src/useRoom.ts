import { useEffect, useState, useCallback, useContext } from 'react'
import { Libp2pContext } from './providers/Libp2pProvider'
// default variables in callback

const DEFAULT_OPTIONS = {
  pollInterval: 1000
}


export const useRoom = ({topic='default', options=DEFAULT_OPTIONS}= {}) => {
  console.log(Libp2pContext)
  const { libp2p, started } = useContext(Libp2pContext)
  
  const [peers, setPeers] = useState<string[]>([])
  const [connections, setConnections] = useState<Object>({})
  const [messages, setMessages] = useState<[]>([])

  const updatePeerList = useCallback(async () => {

  }, [])


  useEffect(() => {
    if (started) {
      libp2p.addEventListener('connection:open', updatePeerList)
      libp2p.addEventListener('connection:close', updatePeerList)
      libp2p.addEventListener('self:peer:update', () => {
      libp2p.addEventListener('message', (event) => {
        const topic = event.detail.topic
        const message = event.detail.data
        setMessages(old => [...old, {topic, message}])
      })
        
      })
      return () => {
        libp2p.removeEventListener('connection:open', updatePeerList)
        libp2p.removeEventListener('connection:close', updatePeerList)
        libp2p.removeEventListener('self:peer:update', () => {})
        libp2p.removeEventListener('message', (event) => {})
      }

    }
  }, [libp2p, started])


  setInterval(() => {
    const peerList = libp2p.services.pubsub.getSubscribers(topic)
    setPeers(peerList)
  }, 500)

}
