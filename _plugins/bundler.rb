require "rubygems"
require "bundler/setup"

Bundler.require(:default)

module Rouge
    module Tokens
        def self.token(name, shortname, &b)
            tok = Token.make_token(name, shortname, &b)
            const_set(name, tok)
        end

        token :BoldOpen, 'bopen'
        token :BoldClose, 'bclose'
    end

    module Lexers
        class EJS < HTML
            tag 'ejs'

            is_open = false

            append :root do
                rule /<%(=|-)?\s*/m do
                    token Keyword
                    push :ejs
                end
            end

            state :ejs do
                rule /\s*%>/, Keyword, :pop!
                rule /.*?(?=\s*%>)/ do
                    delegate Javascript
                end
            end

            state_definitions.each do |name|
                prepend name do
                    rule /(\s*)~~~(\s*)/ do |m|
                        if is_open then
                            token Generic::Output, m[1]
                            token Tokens::BoldClose, '&nbsp;'
                            token Generic::Output, m[2]
                        else
                            token Generic::Output, m[1]
                            token Tokens::BoldOpen, '&nbsp;'
                            token Generic::Output, m[2]
                        end

                        is_open = !is_open
                    end
                end
            end
        end
    end
end
