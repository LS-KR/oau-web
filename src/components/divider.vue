<template>
    <div id="divider">
        <span class="color-strip" v-for="c in colors" :key="c"
              :style="`background-color: ${c}; height: ${height}`"
              v-on:click="switchEasterEgg()"/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { transColors } from "@/logic/constants";
import Swal from 'sweetalert2';
import { i18n } from '@/logic/config';
import { getLang } from '@/logic/config';
import { scheduledTask } from '@/logic/helper';

@Component({components: {}})
export default class Divider extends Vue
{
    @Prop({default: transColors}) colors!: string[]
    @Prop({default: '2px'})       height!: string

    i18n = i18n[getLang()]

    switchEasterEgg() {
        if ((window.location.pathname == '/profile/Elihuso') || (window.location.pathname == '/profile/Elihuso/') && (localStorage.getItem('lang') != 'en')) {
            scheduledTask(50, () => {
                Swal.fire({
                    icon: 'info',
                    html: `<h2 style="text-align: center; color: #ff8373">这个条目曾经被条目人物巡回过甚至由她亲自设计</h2><p style="text-align: left;color: #70512a">事实上, 这个孩子去世前把她自己的条目头部和自己的信息都写好了</p><p style="text-align: left;color: #70512a">作为秋叶前端的主要维护者之一</p><p style="text-align: left;color: #70512a">我们甚至在她的硬盘里发现了这些她写给自己条目的彩蛋</p><br /><p style="text-align: left;color: #70512a">秋叶的故事——没错, 就是妳看到的左上角的那些类似于成就的东西——曾经是由另一个成员充满脑洞的设想</p><p style="text-align: left;color: #70512a">结果她真做出来了, 还真的部署到网站上了</p><p style="text-align: left;color: #70512a">包括那些不会显示到主页的条目, 还有妳刚刚做的——点击页面顶部或底部的跨旗——她都一点点地完成了</p><br /><p style="text-align: left;color: #70512a">可能她正想用这种方法讲述自己的故事吧——自此结束的故事</p>`,
                    timer: 30000,
                    timerProgressBar: true,
                    toast: false,
                    showCancelButton: false,
                    showCloseButton: false,
                    showConfirmButton: false,
                    showDenyButton: false
                })
            })
            return;
        }

        if (!localStorage.getItem("easterEggMode")) 
            localStorage.setItem("easterEggMode", "1")
        else 
            localStorage.setItem("easterEggMode", (parseInt(localStorage.getItem("easterEggMode")) == 0) ? "1" : "0")

        localStorage.setItem("manualModify", "qwq")

        Swal.fire({
            position: "top-end",
            toast: true,
            title: this.i18n.easter_egg.title + ((parseInt(localStorage.getItem("easterEggMode")) == 0) ? this.i18n.easter_egg.disabled : this.i18n.easter_egg.enabled),
            text: ((parseInt(localStorage.getItem("easterEggMode")) == 0) ? null : this.i18n.easter_egg.text),
            timer: 5000,
            showConfirmButton: false,
            showCancelButton: false,
            timerProgressBar: true,
            iconHtml: `<img style="width: 64px;height: 64px;border: none" src="/img/easterEgg.png"></img>`,
            iconColor: "#00000000"
        })
    }
}
</script>

<style lang="sass" scoped>
#divider
    display: flex

    .color-strip
        flex: 1
</style>
