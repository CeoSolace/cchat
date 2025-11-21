import React, { useState, useEffect } from 'react';
import ServerList from '../components/ServerList';
import ChannelList from '../components/ChannelList';
import ChatArea from '../components/ChatArea';
import MemberList from '../components/MemberList';
import UserPanel from '../components/UserPanel';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [servers, setServers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth(); // Use token to make authenticated requests

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const res = await axios.get(`${import.meta.env.VITE_API_URL}/servers`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setServers(res.data.servers);

        // Mock data for now
        const mockServers = [
          { id: '1', name: 'CaughtWiki', icon: null },
          { id: '2', name: 'Esports Arena', icon: null },
          { id: '3', name: 'Community Hub', icon: null },
        ];
        setServers(mockServers);
      } catch (error) {
        console.error('Error fetching servers:', error);
        // Handle error (e.g., show error message, redirect)
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchServers();
    }
  }, [token]);

  useEffect(() => {
    const fetchServerData = async () => {
      if (!selectedServer) {
        setChannels([]);
        setMembers([]);
        return;
      }

      try {
        setLoading(true);
        // Replace with actual API calls
        // const [channelsRes, membersRes] = await Promise.all([
        //   axios.get(`${import.meta.env.VITE_API_URL}/channels/${selectedServer.id}`, {
        //     headers: { Authorization: `Bearer ${token}` }
        //   }),
        //   axios.get(`${import.meta.env.VITE_API_URL}/members/${selectedServer.id}`, {
        //     headers: { Authorization: `Bearer ${token}` }
        //   })
        // ]);

        // setChannels(channelsRes.data.channels);
        // setMembers(membersRes.data.members);

        // Mock data for now
        const mockChannels = [
          { id: 'c1', name: 'general', type: 'text', serverId: selectedServer.id },
          { id: 'c2', name: 'esports-discussion', type: 'text', serverId: selectedServer.id },
          { id: 'c3', name: 'announcements', type: 'text', serverId: selectedServer.id },
        ];
        setChannels(mockChannels);

        const mockMembers = [
          { id: 'u1', username: 'Solace', status: 'online' },
          { id: 'u2', username: 'Melt', status: 'offline' },
          { id: 'u3', username: 'Admin', status: 'dnd' },
        ];
        setMembers(mockMembers);
      } catch (error) {
        console.error('Error fetching server data:', error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchServerData();
  }, [selectedServer, token]);

  const handleServerSelect = (server) => {
    setSelectedServer(server);
    setSelectedChannel(null); // Reset channel selection when server changes
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full bg-gray-900">Loading...</div>;
  }

  return (
    <div className="flex h-full w-full">
      {/* Server List Sidebar */}
      <div className={`bg-gray-800 h-full flex flex-col items-center py-3 ${isSidebarCollapsed ? 'w-16' : 'w-20'}`}>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="text-gray-400 hover:text-white mb-4"
        >
          {isSidebarCollapsed ? '→' : '←'}
        </button>
        <ServerList servers={servers} onServerSelect={handleServerSelect} selectedServerId={selectedServer?.id} isCollapsed={isSidebarCollapsed} />
        <div className="mt-auto">
          <UserPanel isCollapsed={isSidebarCollapsed} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Channel List Sidebar - Only show if a server is selected */}
        {selectedServer && (
          <div className={`bg-gray-700 h-full ${isSidebarCollapsed ? 'hidden' : 'w-60'}`}>
            <ChannelList channels={channels} onChannelSelect={handleChannelSelect} selectedChannelId={selectedChannel?.id} />
          </div>
        )}

        {/* Chat Area & Member List - Only show if a channel is selected */}
        {selectedChannel && (
          <>
            <div className="flex-1 flex flex-col">
              <ChatArea channel={selectedChannel} />
            </div>
            <div className={`bg-gray-700 h-full ${isSidebarCollapsed ? 'hidden' : 'w-60'}`}>
              <MemberList members={members} />
            </div>
          </>
        )}

        {/* Placeholder when no server or channel is selected */}
        {!selectedServer && (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <p className="text-xl text-gray-500">Select a server to start chatting</p>
          </div>
        )}
        {selectedServer && !selectedChannel && (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <p className="text-xl text-gray-500">Select a channel to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
