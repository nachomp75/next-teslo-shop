import type { NextApiRequest, NextApiResponse } from 'next';

import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

import { IProduct } from '@/interfaces';
import { db } from '@/database';
import { Product } from '@/models';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = { message: string } | IProduct[] | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(res);

    case 'PUT':
      return updateProduct(req, res);

    case 'POST':
      return createProduct(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getProducts = async (res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await Product.find().sort({ title: 'asc' }).lean();
  await db.disconnect();

  const updatedProduct = products.map((product) => {
    product.images = product.images.map((image) =>
      image.includes('https')
        ? image
        : `${process.env.HOST_NAME}/products/${image}`
    );

    return product;
  });

  return res.status(200).json(updatedProduct);
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = '', images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'Product ID not valid' });
  }

  if (images.length < 2) {
    return res.status(400).json({ message: 'At least two images required' });
  }

  // TODO: Avoid localhost:3000/products/efvkewbf.jpg

  try {
    await db.connect();
    const product = await Product.findById(_id);
    if (!product) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: 'There is no product with this ID' });
    }

    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        const [fileId] = image.substring(image.lastIndexOf('/') + 1).split('.');
        await cloudinary.uploader.destroy(fileId);
      }
    });

    await product.update(req.body);
    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    await db.disconnect();
    return res.status(400).json({ message: 'Check server logs' });
  }
};

const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res.status(400).json({ message: 'At least two images required' });
  }

  // TODO: Avoid localhost:3000/products/efvkewbf.jpg

  try {
    await db.connect();
    const productInDB = await Product.findOne({ slug: req.body.slug });
    if (productInDB) {
      return res
        .status(400)
        .json({ message: 'A product with the same slug already exists' });
    }

    const product = new Product(req.body);
    await product.save();
    await db.disconnect();

    return res.status(201).json(product);
  } catch (error) {
    await db.disconnect();
    return res.status(400).json({ message: 'Check server logs' });
  }
};
