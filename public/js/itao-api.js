var ITAO = {

    endpoints: {

        test: {
            base_url: 'data',
            login_url: '/',
            company_url: "/company.json",
            networks_url: "/metrics.network.json",
            user_metrics_url: "/metrics.users.json",
            channel_metrics_url: "/metrics.channels.json",
            total_metrics_url: "/{period}/metrics.total.json",
            distributed_metrics_url: "/{period}/metrics.distributed.json",
            test_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRlbW8iLCJpZCI6MSwibmFtZSI6IkRlbW8gOVgiLCJjb21wYW55Ijp7ImlkIjoyNzQsIm5hbWUiOiJOaW5lIENvbm5lY3Rpb25zIiwiY29kZSI6Im5pbmVfY29ubmVjdGlvbnMifSwiaWF0IjoxNDY4MzEyNTY2LCJleHAiOjE0NzA5MDQ1NjYsImlzcyI6Ijl4In0=.AoUogBqeT8UWHqEwNkzbudc4JUbX0eFBf9uX88FOp0k="
        },

        live: {
            base_url: 'https://itao-api.nineconnections.com',
            login_url: '/auth',
            company_url: "/company",
            networks_url: "/metrics/total/networks?period=P{period}D",
            user_metrics_url: "/metrics/total/users?period=P{period}D",
            channel_metrics_url: "/metrics/total/channels?period=P{period}D",
            total_metrics_url: "/metrics/total?period=P{period}D",
            distributed_metrics_url: "/metrics/distributed?period=P{period}D"
        }

    },

    API: function (endpoint, token) {
        this.endpoint = endpoint
        this.endpoint.token = token
    }

};

ITAO.API.prototype = {

    toJson: function (response) {
        return response.json()
    },

    logError: function (message, exception) {
        console.log(message, exception)
    },

    login: function(username, password) {
        var url = this.endpoint.base_url + this.endpoint.login_url
        return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'username=' + username + '&password=' + password
            })
            .then(function(response) { 
                // Convert to JSON
                return response.json();
            })
            .then(function(reply) { return reply })
    },

    loadCompany: function () {
        var url = this.endpoint.base_url + this.endpoint.company_url
        return fetch(url, { headers: { Authorization: 'Bearer ' + this.endpoint.token } })
            .catch(this.logError.bind(this, 'could not load company from ' + url))
            .then(this.toJson)
    },

    loadNetworkMetrics: function (period) {
        var url = this.endpoint.base_url + this.endpoint.networks_url.replace('{period}', period)
        return fetch(url, { headers: { Authorization: 'Bearer ' + this.endpoint.token } })
            .catch(this.logError.bind(this, 'could not update networks metrics from ' + url))
            .then(this.toJson)
            .then(function (json) { return _.indexBy(json.networks, 'name') })
    },

    loadChannelMetrics: function (period) {
        var url = this.endpoint.base_url + this.endpoint.channel_metrics_url.replace('{period}', period)
        return fetch(url, { headers: { Authorization: 'Bearer ' + this.endpoint.token } })
            .catch(this.logError.bind(this, 'could not update channel metrics from ' + url))
            .then(this.toJson)
            .then(function (json) { return json.channels })
    },

    loadUserMetrics: function (period) {
        var url = this.endpoint.base_url + this.endpoint.user_metrics_url.replace('{period}', period)
        return fetch(url, { headers: { Authorization: 'Bearer ' + this.endpoint.token } })
            .catch(this.logError.bind(this, 'could not update user metrics from ' + url))
            .then(this.toJson)
            .then(function (json) { return json.users })
    },

    loadTotalMetrics: function (period) {
        var url = this.endpoint.base_url + this.endpoint.total_metrics_url.replace('{period}', period)
        return fetch(url, { headers: { Authorization: 'Bearer ' + this.endpoint.token } })
            .catch(this.logError.bind(this, 'could not update total metrics from ' + url))
            .then(this.toJson)
    },

    loadDistributedMetrics: function (period) {
        var url = this.endpoint.base_url + this.endpoint.distributed_metrics_url.replace('{period}', period)
        return fetch(url, { headers: { Authorization: 'Bearer ' + this.endpoint.token } })
            .catch(this.logError.bind(this, 'could not update distributed metrics from ' + url))
            .then(this.toJson)
            .then(function (json) {
                function toData(value) { return value.data; }
                return _.chain(json.series)
                    .indexBy('type')
                    .mapObject(toData)
                    .value()
            })
    }

}
