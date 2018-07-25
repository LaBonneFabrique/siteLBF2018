export var avatarMixin = {
  methods: {
    avatar: function (mId, size) {
      return 'https://api.adorable.io/avatars/' + size + '/' + mId + '.png'
    }
  }
}
