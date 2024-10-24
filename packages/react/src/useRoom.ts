import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { Libp2pContext } from './providers/Libp2pProvider'
// default variables in callback

const DEFAULT_OPTIONS = {
  pollInterval: 1000
}


export const useRoom = ({topic='default', options=null}= {}) => {
  const { libp2p } = useContext(Libp2pContext)
  const [peers, setPeers] = useState<string[]>([])
  const [connections, setConnections] = useState<Object>({})
  const [options, setOptions] = useState(options || DEFAULT_OPTIONS)
  const [messages, setMessages] = useState<[]>([])

  const updatePeerList = useCallback(async () => {

  }, [])


  useEffect(() => {
    libp2p.addEventListener('connection:open', updatePeerList)
    return () => {
      libp2p.removeEventListener('connection:open', updatePeerList)
    }
  }, [])

  useEffect(() => {
    libp2p.addEventListener('connection:close', updatePeerList)
    return () => {
      libp2p.removeEventListener('connection:close', updatePeerList)
    }
  }, [])

  useEffect(() => {
    libp2p.addEventListener('self:peer:update', () => {
      const multiaddrs = libp2p.getMultiaddrs()
      setConnections(multiaddrs)

    })
    return () => {
      libp2p.removeEventListener('self:peer:update', () => {})
    }
  }, [])


  setInterval(() => {
    const peerList = libp2p.services.pubsub.getSubscribers(topic)
    setPeers(peerList)
  }, 500)

  useEffect(() => {
    libp2p.addEventListener('message', (event) => {
      const topic = event.detail.topic
      const message = event.detail.data
      setMessages([...messages, {topic, message}])
    })

    return () => {
      libp2p.removeEventListener('message', (event) => {})
    }
  }, [])





}
