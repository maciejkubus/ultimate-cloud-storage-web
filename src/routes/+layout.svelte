<script lang="ts">
	import { Drawer, Toast, drawerStore, Modal } from '@skeletonlabs/skeleton';
	import '../style/theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../style/app.postcss';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Modal />
<Toast position="tr" />
<slot />
