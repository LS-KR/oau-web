<script lang="ts">
import {BannerData} from "@/logic/data";
import {Component, Prop, Vue} from 'vue-facing-decorator';

@Component({})
export default class Banner extends Vue {
    @Prop({ required: true }) data!: BannerData
}
</script>

<template>
    <div
        class="banner">
        <div class="img-container">
            <img :src="data.icon"/>
        </div>
        <div class="content">
            <h3 v-text="data.title"/>
            <p v-text="data.text"></p>
        </div>
    </div>
</template>

<style lang="scss">
@import "@/css/colors";

.banner {
    width: 90%;
    margin: 10px auto;
    min-height: 100px;
    display: block;
    background: $color-bg-5;
    border-radius: 30px;
    border-color: $color-text-light;
    border-style: solid;
    border-width: 2px;
    height: fit-content;

    .img-container {
        height: 80px;
        width: 80px;
        margin: 10px;
        display: inline-grid;
        vertical-align: top;

        img {
            width: 100%;
            height: 100%;
            border-radius: 20px;
        }
    }

    .content {
        min-height: 80px;
        width: calc(100% - 150px);
        margin: 10px;
        display: inline-grid;
        vertical-align: top;

        h3 {
            color: $color-text-main;
            margin: 5px;
            font-size: 1.4rem;
        }

        p {
            color: $color-text-light;
            margin: 5px;
            font-size: 1rem;
        }
    }
}

[data-theme="dark"] {
    .banner {
        border-color: $color-text-dark-light;
        background: $color-bg-dark-5;

        .content {
            h3 {
                color: $color-text-dark-main;
            }

            p {
                color: $color-text-dark-light;
            }
        }
    }
}
</style>