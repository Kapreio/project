module.exports = {
    plugins: {
        'autoprefixer': {
            browsers: ['last 5 version', 'Android >= 4.0'], 
            cascade: true, //是否美化属性值 默认：true 
            remove: true //是否去掉不必要的前缀 默认：true 
        }
    }
}