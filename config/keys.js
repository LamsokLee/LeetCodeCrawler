
if ( process.env.NODE_ENV === 'production'){
    m = require('./prod')
}
else{
    m = require('./dev')
}

m['problem_list_api'] = "https://leetcode.com/api/problems/algorithms/"
m['problem_base'] = "https://leetcode.com/problems/"

module.exports = m