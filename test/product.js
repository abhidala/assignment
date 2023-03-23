process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Product = require('../models/product');
const chai = require('chai');
const chaiHttp = require('chai-http');
const index =  require('../index');
const should = chai.should();

chai.use(require('chai-match'));
chai.use(chaiHttp);
describe('Products',()=>{
    beforeEach((done)=>{
        Product.remove({},err=>{
            done();
        });
    });
    describe('/GET product route',()=>{
        it('should get all the products',(done)=>{
            chai.request(index).get('/product').end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
        });
    });
    describe('/POST product route',()=>{
        it('should POST a product',(done)=>{
            let product = {
                title:"Refrigerator",
    version:"S56",
    yearMade:2022,
    countryMade:"India",
            }
            chai.request(index).post('/product').send(product).end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Product successfully added');
                res.body.should.have.property('product');
                res.body.should.have.nested.property('product.title').eql(product.title);
                res.body.should.have.nested.property('product.version');
                res.body.should.have.nested.property('product.yearMade');
                res.body.should.have.nested.property('product.countryMade');
                done();
            });
        });
    });
    describe('/GET/:id product route',()=>{
        it('should get product by given id',(done)=>{
            let product = new Product({title:"Refrigerator", version:"S56", yearMade:2022,countryMade:"India"});
            product.save((err,product)=>{
                chai.request(index).get('/product/'+product.id).send(product).end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('version');
                    res.body.should.have.property('yearMade');
                    res.body.should.have.property('countryMade');
                    done();
                });
            });

        });
    });
    describe('/PUT/:id product route',()=>{
        it('should update a product by given id',(done)=>{
            let product = new Product({title:"Television",version:"S50",yearMade:2023,countryMade:"Japan"});
            product.save((err,product)=>{
                chai.request(index).put('/product/'+product.id).send({title:"Television",version:"Samsung S56",yearMade:2022,countryMade:"India"}).end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Product updated succesfully');
                    res.body.should.have.nested.property('product.title').eql('Television');
                    res.body.should.have.nested.property('product.version').eql('Samsung S56');
                    res.body.should.have.nested.property('product.yearMade').eql(2022);
                    res.body.should.have.nested.property('product.countryMade').eql('India');
                    done();
                });
            });
        });
    });
        describe('/DELETE/:id product',()=>{
            it('should delete a product by given id',(done)=>{
                let product = new Product({title:"Mobile", version:"Samsung S40",yearMade:2023,countryMade:"India"});
                product.save((err,product)=>{
                    chai.request(index).delete('/product/'+product.id).end((err,res)=>{
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Product deleted successfully');
                        res.body.should.have.nested.property('result.acknowledged').eql(true);
                        res.body.should.have.nested.property('result.deletedCount').eql(1);
                        done();
                    });
                });
            });
        });
       describe('/SEARCH/:key product',()=>{
        it('should return product searched by given key',(done)=>{
            let product = new Product({title:"Refrigerator",version:"Samsung S56",yearMade:2022,countryMade:"India"});
            product.save((err,product)=>{
                chai.request(index).get('/search/'+'K').end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.map((e)=>e.version ).every((version)=>version.should.match(/K/i));
                    done();
                })
            })
        })
       })
    

});