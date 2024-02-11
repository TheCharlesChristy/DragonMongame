from CrytographyFunctions import generateprivatekey, generatepublickey, generatecsr, signcsr
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from getpass import getpass
from cryptography.hazmat.primitives import serialization
Password = str(input("Password"))
privatekey = generateprivatekey("ca-private-key.pem", Password)
generatepublickey(
  privatekey,
  filename="ca-public-key.pem",
  country="UK",
  state="Bedfordshire",
  locality="Bedford",
  org="My CA Company",
  hostname="MYca.com",
)


serverpassword = str(input("ServerPassword"))
serverprivatekey = generateprivatekey(
  "server-private-key.pem", serverpassword
)
generatecsr(
  serverprivatekey,
  filename="server-csr.pem",
  country="UK",
  state="Bedfordshire",
  locality="Bedford",
  org="My Server",
  alt_names=["dragonmongame.com","www.dragonmongame.com" ,"*"],
  hostname="dragonmongame.com",
)
csrfile = open("server-csr.pem", "rb")
csr = x509.load_pem_x509_csr(csrfile.read(), default_backend())
capublickeyfile = open("ca-public-key.pem", "rb")
capublickey = x509.load_pem_x509_certificate(
  capublickeyfile.read(), default_backend()
)
caprivatekeyfile = open("ca-private-key.pem", "rb")
caprivatekey = serialization.load_pem_private_key(
  caprivatekeyfile.read(),
  getpass().encode("utf-8"),
  default_backend(),
)
signcsr(csr, capublickey, caprivatekey, "server-public-key.pem")