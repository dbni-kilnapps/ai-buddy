<script>
	//making this fully local because I have no idea how sveltekit's server actions work
	import { chatHistory } from '$lib/stores';
	import ollama from 'ollama';
	import { onMount } from 'svelte';
	//simulate a chat history
	let currentResponse = '';
	let chatMsg = '';
	/**
	 * @type {import("ollama").Message[]}
	 */
	let history;

	chatHistory.subscribe((value) => {
		history = value;
	});


	

	//jsdoc
	/**
	 * @param {string} messageContent
	 */
	async function sendChat(messageContent) {
		const message = { role: 'user', content: messageContent };
		chatHistory.update((chatHistory) => [
			...chatHistory,
			message]);

		const response = await ollama.chat({
			model: 'llama3',
			messages: history,
			stream: true
		});
		let fullResponse = '';
		for await (const part of response) {
			currentResponse += part.message.content;
		}
		fullResponse = currentResponse;
		currentResponse = '';
		chatHistory.update((chatHistory) => [
			...chatHistory,
			{ role: 'assistant', content: fullResponse }
		]);
	}
</script>

<form on:submit|preventDefault={() => sendChat(chatMsg)}>
	<input name="chat" type="text" placeholder="Message your buddy..." bind:value={chatMsg} />
	<button>Send message</button>
</form>

<!-- TODO: Make this look nice -->
{#each history as message}
	<div class="chat-message">
		<p>{message.content}</p>
	</div>
{/each}

{#if currentResponse.length > 0}
<p>{currentResponse}</p>
{/if}