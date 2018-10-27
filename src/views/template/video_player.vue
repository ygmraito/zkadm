<template>
	<video-player class="video-player-box" ref="videoPlayer" :options="playerOptions" :playsinline="true" customEventName="customstatechangedeventname" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @ended="onPlayerEnded($event)" @waiting="onPlayerWaiting($event)" @playing="onPlayerPlaying($event)" @loadeddata="onPlayerLoadeddata($event)" @timeupdate="onPlayerTimeupdate($event)" @canplay="onPlayerCanplay($event)" @canplaythrough="onPlayerCanplaythrough($event)" @statechanged="playerStateChanged($event)" @ready="playerReadied">
	</video-player>
</template>

<script>
	import 'video.js/dist/video-js.css'
	import { videoPlayer } from 'vue-video-player';
	// Similarly, you can also introduce the plugin resource pack you want to use within the component
	// import 'some-videojs-plugin'

	export default {
		name: 'video_player',
		props: ["VideoAuto", "VideoUrl", "VideoCover", "VideoClose", "VideoHeight", "VideoWidth"],
		data() {
			return {
				playerOptions: {
					// videojs options
					autoplay: this.VideoAuto,
					muted: false,
					language: 'en',
					playbackRates: [0.7, 1.0, 1.5, 2.0],
					sources: this.VideoUrl,
					poster: this.VideoCover,
					height: this.VideoHeight,
					width: this.VideoWidth
				}
			}
		},
		watch: {
			VideoUrl(curVal, oldVal) {
				this.playerOptions.sources = curVal
			},

			VideoCover(curVal, oldVal) {
				this.playerOptions.poster = curVal
			}
		},
		mounted() {
			console.log('this is current player instance object', this.player)
		},
		computed: {
			player() {
				return this.$refs.videoPlayer.player
			}
		},
		components: {
			videoPlayer
		},
		methods: {
			// listen event
			onPlayerPlay(player) {
				// console.log('player play!', player)
			},
			onPlayerPause(player) {
				// console.log('player pause!', player)
			},
			// ...player event

			// or listen state event
			playerStateChanged(playerCurrentState) {
				// console.log('player current update state', playerCurrentState)
			},

			// player is ready
			playerReadied(player) {
				//console.log('the player is readied', player)
				// you can use it to do something...
				// player.[methods]
			},

			onPlayerEnded(player) {
				//console.log('the player is readied', player)

			},

			onPlayerWaiting(player) {
				//console.log('the player is readied', player)

			},
			onPlayerPlaying(player) {
				//console.log('the player is readied', player)

			},

			onPlayerLoadeddata(player) {
				//console.log('the player is readied', player)
				//
			},
			onPlayerTimeupdate(player) {
				//console.log('the player is readied', player)

			},
			onPlayerCanplay(player) {
				//console.log('the player is readied', player)

			},
			onPlayerCanplaythrough(player) {
				//console.log('the player is readied', player)

			},
			playerStateChanged(player) {
				//console.log('the player is readied', player)

			},
			playerReadied(player) {
				//console.log('the player is readied', player)

			},

		}
	}
</script>