resource "aws_key_pair" "swingify-key" {
    key_name = "swingify-key"
    public_key = file("./swingify.pem")
}