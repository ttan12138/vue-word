<template>
  <div style="height: calc(100%);">
    <!-- 富文本编辑器 -->
    <editor
      id="tinymce"
      v-model="articleContent"
      :init="editorInit"
      :key="tinymceFlag"
    ></editor>
  </div>
</template>
<script>
/* eslint-disable */
// 引入组件
import tinymce from "tinymce/tinymce";
import Editor from '@tinymce/tinymce-vue';
//引入jQuery和导出Word的JS文件
import $ from "jquery";
require("../assets/js/jquery.wordexport.js");
//引入工具栏图标和主题
import "tinymce/icons/default/icons";
import "tinymce/themes/silver";
// 引入富文本编辑器主题的js和css
import "tinymce/themes/silver/theme.min";
import "tinymce/skins/ui/oxide/skin.min.css";
// 扩展插件 - 根据需要引入
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount"; // 字数统计插件
// import "tinymce/plugins/media"; // 插入视频插件
// import "tinymce/plugins/template"; // 模板插件
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/preview";
import 'tinymce/models/dom'
import html2canvas from "html2canvas"
// import "/public/tinymce/importword"
// import { PDFDocument } from 'pdf-lib';
// import saveAs from 'file-saver';
import jsPDF from 'jspdf'
// import x2js from "@/utils/x2js";
export default {
  name: "WordEditor",
  components: { Editor },
  props: {
    // height: {
    //   type: Number,
    //   default: 669,
    // },
    //从后台获取的字符串HTML数据，
    value: {
      type: String,
      // 这里我设定个默认值，实际开发中可至为空 - default:"",根据需求修改。
      default: ``,
    },
    previewWidth: {
      type: Number,
      default: 749
    },
    previewHeight: {
      type: Number,
      default: 669
    },
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    baseUrl: {
      type: String,
      default: "",
    },
    plugins: {
      //使用的插件 - 根据需求进行删减
      type: [String, Array],
      default:
        // "link lists image code table wordcount media fullscreen paste preview importword",
        "lists code table wordcount fullscreen preview",
    },
    toolbar: {
      //工具栏 - 根据需求进行删减
      type: [String, Array],
      default: // importword |  unlink image |
        "fontselect | bold italic underline strikethrough | link unlink | undo redo | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | code | removeformat",
    },
    showToolbar:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      articleContent: this.value,
      tinymceFlag: "",
      editorInit: {
        language_url: "tinymce/langs/zh_CN.js", //引用public下的文件
        language: "zh_CN",
        skin_url: "tinymce/skins/ui/oxide",
        content_css: "tinymce/skins/content/default/content.css",
        height: this.height,
        content_style:
          "* { padding:0; margin:0; } img {max-width:100% !important }",
        plugin_preview_width: this.previewWidth, // 预览宽度
        plugin_preview_height: this.previewHeight,
        lineheight_val:
          "1 1.1 1.2 1.3 1.35 1.4 1.5 1.55 1.6 1.75 1.8 1.9 1.95 2 2.1 2.2 2.3 2.4 2.5 2.6 2.7 2.8 3 3.1 3.2 3.3 3.4 4 5",
        fontsize_formats:
          "8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 24pt 36pt",
        font_formats:
          "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
        plugins: this.plugins,
        powerpaste_word_import: "merge",
        toolbar: this.toolbar,
        toolbar_mode:"sliding",
        paste_data_images: true,
        statusbar: true, // 底部的状态栏
        menubar: true, // 最上方的菜单
        branding: false, // 水印“Powered by TinyMCE”
        // //上传图片配置
        // images_upload_handler: (blobInfo, success) => {
        //   const img = "data:image/jpeg;base64," + blobInfo.base64();
        //   success(img);
        // },
      }
    };
  },
  watch:{
    showToolbar(newValue, oldValue){
      if(newValue){
        document.documentElement.style.setProperty("--show-tool","flex");
      }else{
        document.documentElement.style.setProperty("--show-tool","none");
      }
    }
  },
  mounted() {
    if(this.showToolbar){
      document.documentElement.style.setProperty("--show-tool","flex");
    }else{
      document.documentElement.style.setProperty("--show-tool","none");
    }
    tinymce.init({});
    
  },
  methods: {
    parseReport(reportHtml){
      const $tempContainer = $('<div>');
      $tempContainer.html(reportHtml.replace(/Evaluation Warning: The document was created with Spire.Doc for \.NET\./g, ''));
      // 获取临时容器中的 body 内容
      $tempContainer.find('[class^="Section"]').find('.页脚').remove()
      $tempContainer.find('[class^="Section"]').find('.Normal').first().remove();

      $tempContainer.find('td').each(function() {
        // 查找当前 <td> 标签下的 <p> 标签
        var $paragraphs = $(this).find('p');
        // 合并 <span> 标签的内容
        $paragraphs.each(function() {
          var $spans = $(this).find('span');
          var $childrens = $(this).children()
          if ($spans.length == $childrens.length && $spans.length > 1) {
            var mergedText = "";
            var attributes = $spans.prop('attributes');

            // 创建目标 span
            var targetSpan = $('<span>');

            // 将源 span 的属性复制到目标 span
            $.each(attributes, function() {
              targetSpan.attr(this.name, this.value);
            });
            $spans.each(function() {
              mergedText += $(this).text();
              $(this).remove();
            });
            targetSpan.text(mergedText)
            $(this).append(targetSpan);
          }
        });
      });
      this.articleContent = `${$tempContainer.html()}`
    },
    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(blob);
        fileReader.onload = () => {
          resolve(fileReader.result.replace("data:application/msword;charset=utf-8;base64,", ""));
        };
        fileReader.onerror = () => {
          reject(new Error('文件流异常'));
        };
      });
    },
    convertDocToPdfBase64() {
      // const pdfDoc = await PDFDocument.create();

      // // 解码DOC文件数据
      // const docData = atob(docBase64);

      // // 将DOC数据添加到PDF文档
      // const docUint8Array = new Uint8Array(docData.length);
      // for (let i = 0; i < docData.length; i++) {
      //   docUint8Array[i] = docData.charCodeAt(i);
      // }
      // const doc = await PDFDocument.load(docUint8Array);
      // const copiedPages = await pdfDoc.copyPages(doc, doc.getPageIndices());
      // copiedPages.forEach((page) => {
      //   pdfDoc.addPage(page);
      // });

      // // 将PDF文档转换为Base64编码
      // const pdfBytes = await pdfDoc.save();
      // const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

      // return pdfBase64;
    },
    exportPDF(html, width=210, height=297) {
      return new Promise((resolve, reject) => {
        try {
          // 创建一个隐藏的容器元素
          const container = document.createElement('div');
          container.style.width = `794px`;
          container.style.overflow = 'hidden';
          container.style.position = 'fixed';
          container.innerHTML = html.innerHTML;
          console.log(container.innerHTML)
          document.body.appendChild(container);

          // 使用html2canvas将HTML转换为Canvas
          html2canvas(container, {
            scale: 1,
            scrollX: 0,
            scrollY: 0
          }).then((canvas) => {
            console.log(canvas)
            // document.body.removeChild(container);

            // 创建一个新的jsPDF实例
            const pdf = new jsPDF('p', 'mm', 'a4');

            // 计算每页的高度
            // const pageHeight = pdf.internal.pageSize.getHeight();
            const pageHeight = 1123
            // 将Canvas分割为适应多页A4尺寸的多个Canvas
            const totalPages = Math.ceil(canvas.height / pageHeight);
            for (let i = 0; i < totalPages; i++) {
              if (i > 0) {
                pdf.addPage();
              }
              const pageCanvas = document.createElement('canvas');
              const pageCtx = pageCanvas.getContext('2d');
              pageCanvas.width = canvas.width;
              pageCanvas.height = Math.min(pageHeight, canvas.height - i * pageHeight);
              pageCtx.drawImage(
                canvas,
                0,
                i * pageHeight,
                pageCanvas.width,
                pageCanvas.height,
                0,
                0,
                pageCanvas.width,
                pageCanvas.height
              );
              const imageData = pageCanvas.toDataURL('image/jpeg', 1.0);
              pdf.addImage(imageData, 'JPEG', 0, 0, width, height);
            }

            // 生成PDF文件
            const pdfBlob = pdf.output('blob');
            // const link = document.createElement('a')
            // let blob = new Blob([pdfBlob], { type: 'application/pdf' })
            // let url = URL.createObjectURL(blob)
            // link.href = url
            // link.download = '???.pdf'
            // link.click()
            resolve(pdfBlob);
          }).catch((error) => {
            // document.body.removeChild(container);
            reject(error);
          });
        } catch (error) {
          reject(error);
        }
        
      });
    },
    // 导出word
    exportWord() {
      // 找到编辑框里面的dom对象
      return new Promise(async (resolve) => {
        var dom = $("#tinymce_ifr")[0].contentDocument.documentElement;
        const pdfblob = await this.exportPDF($(dom).find('.mce-content-body')[0])
        const pdfbase = await this.blobToBase64(pdfblob).then((res) => res)
        const wordbase = await this.blobToBase64($(dom).find('.mce-content-body').wordExport("")).then((res) => res)
        resolve({
          pdfbase,
          wordbase
        })
      })
      
    },
    replaceImage(images = [{ 
      key: '_BEHAVIOR_',
      value: 'imgUrl',
      height: 50, 
      width: 50
    }]) {
      
      // console.log("replaceImage", images)
      images.forEach((img) => {
        this.articleContent = this.articleContent.replace(img.key, `<img  src="data:image/png;base64,${img.value}" width="${img.width}" height="${img.height}" />`)
      })
      // pageMethods.loadPage(true)
    },
    replaceText(texts = [{ 
      key: '_BEHAVIOR_',
      value: 'imgUrl'
    }]) {
      // console.log("texts",texts)
      texts.forEach((text) => {
        this.articleContent = this.articleContent.replace(text.key, text.value)
      })
      // pageMethods.loadPage(true)
    },
    generateHTML() {
      let html = '';

      // // 递归遍历JSON对象
      // function traverse(obj) {
      //   for (const key in obj) {
      //     if (obj.hasOwnProperty(key)) {
      //       const value = obj[key];

      //       // 基本类型值
      //       if (typeof value === 'string') {
      //         html += `<${key}>${value}</${key}>`;
      //       }
      //       // 对象类型值
      //       else if (typeof value === 'object') {
      //         html += `<${key}>`;
      //         traverse(value);
      //         html += `</${key}>`;
      //       }
      //       // 数组类型值
      //       else if (Array.isArray(value)) {
      //         value.forEach((item) => {
      //           html += `<${key}>`;
      //           traverse(item);
      //           html += `</${key}>`;
      //         });
      //       }
      //     }
      //   }
      // }

      // traverse(jsonObj);

      return html;
    },
    replaceXml(xmls){
      xmls.forEach((xml) => {
        console.log("◆keyImage◆", xml.value)
        console.log(this.$newx2js.xml2js)
        console.log((value) => this.generateHTML(this.$x2js.xml2js(value)))
        this.articleContent = this.articleContent.replace(xml.key, xml.value)
      })
    },
    printData(){
      console.log($("#tinymce_ifr")[0].contentWindow.print())
    }
  },
};
</script>
<style scoped>

.flexBtnBox{
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
}
.flexBtnBox > .el-button{
  flex: 1;
}
:deep(.tox-promotion){
  display: none;
}
:deep(.tox.tox-tinymce){
  height: calc(100%) !important;
}
:deep(.tox-menubar),
:deep(.tox .tox-toolbar),
:deep(.tox .tox-toolbar__overflow),
:deep(.tox .tox-toolbar__primary),
:deep(.tox .tox-statusbar){
  display: var(--show-tool)!important;
}
</style>
