<template>
    <div id="About">
        <div class="markdown-content" style="margin: 10px min(4vw, 40px)" v-html="html" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import aboutHtml from "@/assets/about.md";
import aboutHtmlHant from "@/assets/about.zh_hant.md";
import aboutHtmlEn from "@/assets/about.en.md";
import { getLang } from "@/logic/config";
import { handleAntares } from '@/logic/easterEgg';
import { handleIconFromString, randint, scheduledTask } from '@/logic/helper';
import router from '@/router';

@Component({})
export default class About extends Vue
{
    lang = getLang();
    html = handleIconFromString(this.lang === 'zh_hans' ? aboutHtml : (this.lang === 'zh_hant' ? aboutHtmlHant : aboutHtmlEn));

    updated() {
        scheduledTask(250, () => {
            if (handleAntares()) {
                const i = randint(0, 100);
                if (i < 6) router.push('/profile/Mio')
                else if (i < 20) router.push('/profile/ArtsEpiphany')
                //else if (i < 44) router.push('/profile/BeiyanYunyi') // if she passed away, un-comment this line.
            }
        })
    }
}
</script>
