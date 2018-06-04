import marked from 'marked'

export var parseMarkdownMixins = {
  methods: {
    parseMarkdown (texte) {
      return marked(texte, {breaks: true})
    }
  }
}
