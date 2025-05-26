<script lang="ts">
  import { onMount } from 'svelte';
  let messages: { text: string; sender: 'user' | 'bot' }[] = [
    { text: '👋 Hi there! How can I assist?', sender: 'bot' },
  ];
  let input = '';
  let ws: WebSocket;

  onMount(() => {
    ws = new WebSocket('ws://localhost:3001');
    ws.onmessage = (event: MessageEvent) => {
      messages = [...messages, { text: event.data, sender: 'bot' }];
    };
  });

  function sendMessage() {
    if (input.trim()) {
      ws.send(input);
      messages = [...messages, { text: input, sender: 'user' }];
      input = '';
    }
  }

  function quickReply(text: string) {
    sendMessageViaButton(text);
  }

  function sendMessageViaButton(text: string) {
    ws.send(text);
    messages = [...messages, { text, sender: 'user' }];
  }
</script>


<div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-white shadow-lg rounded-xl border overflow-hidden font-sans">

  <div class="bg-purple-700 text-white p-4 flex justify-between items-center">
    <div>
      <div class="font-bold">My Chatbot</div>
      <div class="text-sm">Chatbot Agent</div>
    </div>
    
  </div>

  <div class="h-96 overflow-y-auto p-4 space-y-2 bg-white">
    {#each messages as msg}
      <div class={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        {#if msg.sender === 'bot'}
          <div class="flex items-start gap-2">
            <div class="bg-purple-100 p-2 rounded-lg text-sm max-w-xs">{msg.text}</div>
          </div>
        {:else}
          <div class="bg-gray-100 p-2 rounded-lg text-sm max-w-xs">{msg.text}</div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="flex border-t p-2 gap-2">
    <input
      bind:value={input}
      type="text"
      placeholder="Type here and press Enter..."
      class="flex-1 border rounded-full px-3 py-1 text-sm focus:outline-none"
      on:keydown={(e) => e.key === 'Enter' && sendMessage()}
    />
    <button on:click={sendMessage} class="bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
      Send
    </button>
  </div>
</div>

<style>
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }
</style>
