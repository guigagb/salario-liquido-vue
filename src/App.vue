<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<div class="d-flex align-center">
				<h3>Calculadora Salário Líquido</h3>
			</div>
		</v-app-bar>

		<div class="main-conteiner">
			<Calculadora />
		</div>
	</v-app>
</template>

<script>
import Calculadora from "./components/Calculadora";

export default {
	name: "App",

	components: {
		Calculadora,
	},

	data: () => ({
		//
	}),
};
</script>

<style lang="sass">
.main-conteiner
	width: 100%
	height: 100%
	display: flex
	justify-content: center
	margin-top: 100px
</style>